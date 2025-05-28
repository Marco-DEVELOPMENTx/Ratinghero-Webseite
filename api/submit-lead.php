<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// DSGVO-konforme Konfiguration
$config = [
    'crm_webhook_url' => 'https://your-crm-system.com/api/leads',
    'notification_email' => 'leads@ratinghero.de',
    'smtp_host' => 'smtp.your-provider.com',
    'smtp_username' => 'your-email@ratinghero.de',
    'smtp_password' => 'your-password',
    'smtp_port' => 587
];

// Nur POST-Requests erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// JSON-Daten lesen
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Datenvalidierung
$required_fields = ['name', 'email', 'phone', 'company'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Field '$field' is required"]);
        exit;
    }
}

// E-Mail-Validierung
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Telefonnummer-Validierung
if (!preg_match('/^[\+]?[0-9\s\-\(\)]{10,}$/', $data['phone'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid phone number']);
    exit;
}

// Lead-ID generieren
$lead_id = 'RH-' . date('Ymd') . '-' . substr(md5(uniqid()), 0, 8);

// Lead-Daten für CRM vorbereiten
$lead_data = [
    'lead_id' => $lead_id,
    'timestamp' => date('c'),
    'source' => 'ratinghero.de',
    'campaign' => 'google-bewertungen-funnel',
    'contact' => [
        'name' => sanitize_input($data['name']),
        'email' => sanitize_input($data['email']),
        'phone' => sanitize_input($data['phone']),
        'company' => sanitize_input($data['company']),
        'industry' => sanitize_input($data['industry'] ?? '')
    ],
    'requirements' => [
        'reviews_count' => $data['reviews-count'] ?? '',
        'campaign_speed' => $data['campaign-speed'] ?? '',
        'profiles_count' => $data['profiles-count'] ?? '',
        'team_size' => $data['team-size'] ?? '',
        'profile_url' => sanitize_input($data['profile_url'] ?? ''),
        'additional_urls' => sanitize_input($data['additional_urls'] ?? '')
    ],
    'action' => $data['action'] ?? 'unknown',
    'ip_address' => get_client_ip(),
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
    'gdpr_consent' => true // Implizit durch Formularabsendung
];

try {
    // 1. Lead ins CRM senden
    $crm_response = send_to_crm($lead_data, $config);
    
    // 2. Benachrichtigungs-E-Mail senden
    send_notification_email($lead_data, $config);
    
    // 3. Bestätigungs-E-Mail an Kunden senden
    send_confirmation_email($lead_data, $config);
    
    // 4. Lead in lokaler Datenbank speichern (optional)
    save_lead_to_database($lead_data);
    
    // Erfolgreiche Antwort
    echo json_encode([
        'success' => true,
        'lead_id' => $lead_id,
        'message' => 'Lead erfolgreich übermittelt'
    ]);
    
} catch (Exception $e) {
    error_log('Lead submission error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
    ]);
}

// Hilfsfunktionen
function sanitize_input($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function get_client_ip() {
    $ip_keys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
    foreach ($ip_keys as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = $_SERVER[$key];
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return $ip;
            }
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function send_to_crm($lead_data, $config) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $config['crm_webhook_url'],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($lead_data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer YOUR_CRM_API_KEY'
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code !== 200) {
        throw new Exception("CRM API error: HTTP $http_code");
    }
    
    return json_decode($response, true);
}

function send_notification_email($lead_data, $config) {
    $subject = "Neue Lead-Anfrage von {$lead_data['contact']['company']}";
    $action_text = $lead_data['action'] === 'book' ? 'Buchung' : 'Kostenloser Test';
    
    $message = "
    <html>
    <head><title>Neue Lead-Anfrage</title></head>
    <body>
        <h2>Neue Lead-Anfrage - $action_text</h2>
        <p><strong>Lead-ID:</strong> {$lead_data['lead_id']}</p>
        <p><strong>Zeitstempel:</strong> {$lead_data['timestamp']}</p>
        
        <h3>Kontaktdaten:</h3>
        <ul>
            <li><strong>Name:</strong> {$lead_data['contact']['name']}</li>
            <li><strong>E-Mail:</strong> {$lead_data['contact']['email']}</li>
            <li><strong>Telefon:</strong> {$lead_data['contact']['phone']}</li>
            <li><strong>Unternehmen:</strong> {$lead_data['contact']['company']}</li>
            <li><strong>Branche:</strong> {$lead_data['contact']['industry']}</li>
        </ul>
        
        <h3>Anforderungen:</h3>
        <ul>
            <li><strong>Bewertungen:</strong> {$lead_data['requirements']['reviews_count']}</li>
            <li><strong>Geschwindigkeit:</strong> {$lead_data['requirements']['campaign_speed']}</li>
            <li><strong>Profile:</strong> {$lead_data['requirements']['profiles_count']}</li>
            <li><strong>Teamgröße:</strong> {$lead_data['requirements']['team_size']}</li>
            <li><strong>Profil-URL:</strong> {$lead_data['requirements']['profile_url']}</li>
        </ul>
        
        <h3>Technische Daten:</h3>
        <ul>
            <li><strong>IP-Adresse:</strong> {$lead_data['ip_address']}</li>
            <li><strong>User Agent:</strong> {$lead_data['user_agent']}</li>
        </ul>
    </body>
    </html>
    ";
    
    send_email($config['notification_email'], $subject, $message, $config);
}

function send_confirmation_email($lead_data, $config) {
    $subject = "Bestätigung Ihrer Anfrage - Ratinghero";
    $action_text = $lead_data['action'] === 'book' ? 'Buchung' : 'kostenlosen Testbewertung';
    
    $message = "
    <html>
    <head><title>Bestätigung Ihrer Anfrage</title></head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
        <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
            <h2 style='color: #667eea;'>Vielen Dank für Ihre $action_text!</h2>
            
            <p>Liebe/r {$lead_data['contact']['name']},</p>
            
            <p>wir haben Ihre Anfrage erfolgreich erhalten und freuen uns über Ihr Interesse an unserem vollständig digitalen Service.</p>
            
            <div style='background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3>Ihre Anfrage im Überblick:</h3>
                <p><strong>Lead-ID:</strong> {$lead_data['lead_id']}</p>
                <p><strong>Unternehmen:</strong> {$lead_data['contact']['company']}</p>
                <p><strong>Gewünschte Bewertungen:</strong> {$lead_data['requirements']['reviews_count']}</p>
            </div>
            
            <h3>Was passiert als nächstes?</h3>
            <ul>
                <li>Sie erhalten innerhalb von 24 Stunden Zugang zu Ihrem persönlichen Dashboard</li>
                <li>Automatische Kampagnen-Konfiguration basierend auf Ihren Angaben</li>
                <li>Digitale Strategie-Übersicht für Ihr Unternehmen</li>
                <li>Live-Tracking des Kampagnenfortschritts</li>
            </ul>
            
            <div style='background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                <h4 style='color: #0277bd; margin-bottom: 10px;'>🚀 100% Digitaler Prozess</h4>
                <p style='margin: 0; color: #01579b;'>Keine Telefonate erforderlich - alles läuft automatisiert über unser intelligentes System!</p>
            </div>
            
            <p>Bei Fragen erreichen Sie uns unter:</p>
            <ul>
                <li><strong>E-Mail:</strong> info@ratinghero.de</li>
                <li><strong>Support:</strong> support@ratinghero.de</li>
                <li><strong>Dashboard-Login:</strong> Erhalten Sie in separater E-Mail</li>
            </ul>
            
            <p>Mit freundlichen Grüßen<br>
            Ihr Ratinghero-Team</p>
            
            <hr style='margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;'>
            <p style='font-size: 12px; color: #666;'>
                Diese E-Mail wurde automatisch generiert. Für Support-Anfragen nutzen Sie bitte support@ratinghero.de
                <br>Ratinghero - Digitale Online-Reputation | www.ratinghero.de
            </p>
        </div>
    </body>
    </html>
    ";
    
    send_email($lead_data['contact']['email'], $subject, $message, $config);
}

function send_email($to, $subject, $message, $config) {
    require_once 'vendor/autoload.php'; // PHPMailer
    
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_username'];
        $mail->Password = $config['smtp_password'];
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $config['smtp_port'];
        $mail->CharSet = 'UTF-8';
        
        $mail->setFrom($config['smtp_username'], 'Ratinghero');
        $mail->addAddress($to);
        
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email sending failed: " . $mail->ErrorInfo);
        return false;
    }
}

function save_lead_to_database($lead_data) {
    // Optional: Lead in lokaler Datenbank speichern
    // Hier würden Sie Ihre Datenbankverbindung implementieren
    
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=ratinghero', $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $pdo->prepare("
            INSERT INTO leads (
                lead_id, timestamp, name, email, phone, company, industry,
                reviews_count, campaign_speed, profiles_count, team_size, profile_url,
                action, ip_address, user_agent
            ) VALUES (
                :lead_id, :timestamp, :name, :email, :phone, :company, :industry,
                :reviews_count, :campaign_speed, :profiles_count, :team_size, :profile_url,
                :action, :ip_address, :user_agent
            )
        ");
        
        $stmt->execute([
            ':lead_id' => $lead_data['lead_id'],
            ':timestamp' => $lead_data['timestamp'],
            ':name' => $lead_data['contact']['name'],
            ':email' => $lead_data['contact']['email'],
            ':phone' => $lead_data['contact']['phone'],
            ':company' => $lead_data['contact']['company'],
            ':industry' => $lead_data['contact']['industry'],
            ':reviews_count' => $lead_data['requirements']['reviews_count'],
            ':campaign_speed' => $lead_data['requirements']['campaign_speed'],
            ':profiles_count' => $lead_data['requirements']['profiles_count'],
            ':team_size' => $lead_data['requirements']['team_size'],
            ':profile_url' => $lead_data['requirements']['profile_url'],
            ':action' => $lead_data['action'],
            ':ip_address' => $lead_data['ip_address'],
            ':user_agent' => $lead_data['user_agent']
        ]);
        
        return true;
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        return false;
    }
}
?> 