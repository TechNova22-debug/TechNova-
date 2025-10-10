<?php
// --- CONFIGURATION DE BASE --- //
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "technova_db";
$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Échec de connexion : " . $conn->connect_error);
}

// --- CRÉER LE DOSSIER UPLOAD S’IL N’EXISTE PAS --- //
$uploadDir = "uploads/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// --- AJOUTER UN ARTICLE --- //
if (isset($_POST['ajouter'])) {
    $nom = $_POST['nom'];
    $description = $_POST['description'];
    $prix = $_POST['prix'];
    $quantite = 0; // Toujours 0
    $image = null;

    if (!empty($_FILES['image']['name'])) {
        $imageName = time() . "_" . basename($_FILES['image']['name']);
        $imagePath = $uploadDir . $imageName;
        move_uploaded_file($_FILES['image']['tmp_name'], $imagePath);
        $image = $imageName;
    }

    $sql = "INSERT INTO articles (nom, description, prix, quantite, image) VALUES ('$nom', '$description', '$prix', '$quantite', '$image')";
    $conn->query($sql);
    header("Location: articles.php");
    exit;
}

// --- SUPPRIMER UN ARTICLE --- //
if (isset($_GET['supprimer'])) {
    $id = $_GET['supprimer'];
    $conn->query("DELETE FROM articles WHERE id = $id");
    header("Location: articles.php");
    exit;
}

// --- MODIFIER UN ARTICLE --- //
if (isset($_POST['modifier'])) {
    $id = $_POST['id'];
    $nom = $_POST['nom'];
    $description = $_POST['description'];
    $prix = $_POST['prix'];

    // L’image actuelle
    $result = $conn->query("SELECT image FROM articles WHERE id = $id");
    $article = $result->fetch_assoc();
    $image = $article['image'];

    // Si une nouvelle image est envoyée
    if (!empty($_FILES['image']['name'])) {
        $imageName = time() . "_" . basename($_FILES['image']['name']);
        $imagePath = $uploadDir . $imageName;
        move_uploaded_file($_FILES['image']['tmp_name'], $imagePath);
        $image = $imageName;
    }

    $sql = "UPDATE articles SET nom='$nom', description='$description', prix='$prix', image='$image' WHERE id=$id";
    $conn->query($sql);
    header("Location: articles.php");
    exit;
}

// --- RÉCUPÉRER TOUS LES ARTICLES --- //
$articles = $conn->query("SELECT * FROM articles");
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gestion des articles - TechNova</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 20px; }
        h1 { color: #1f2937; }
        form { background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-bottom: 20px; }
        input, textarea { width: 100%; padding: 8px; margin-top: 5px; margin-bottom: 10px; }
        button { background: #2563eb; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; }
        button:hover { background: #1d4ed8; }
        img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; }
        th, td { padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: left; }
        th { background: #f9fafb; }
        a { color: #dc2626; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>

<h1>Gestion des articles</h1>

<!-- ✅ FORMULAIRE D’AJOUT -->
<form method="post" enctype="multipart/form-data">
    <h3>Ajouter un article</h3>
    <input type="text" name="nom" placeholder="Nom de l’article" required>
    <textarea name="description" placeholder="Description" required></textarea>
    <input type="number" name="prix" placeholder="Prix ($)" step="0.01" required>
    <input type="file" name="image" accept="image/*" required>
    <button type="submit" name="ajouter">Ajouter</button>
</form>

<!-- ✅ TABLEAU DES ARTICLES -->
<table>
    <tr>
        <th>Image</th>
        <th>Nom</th>
        <th>Description</th>
        <th>Prix</th>
        <th>Quantité</th>
        <th>Actions</th>
    </tr>
    <?php while($row = $articles->fetch_assoc()): ?>
    <tr>
        <td><img src="uploads/<?php echo $row['image']; ?>" alt=""></td>
        <td><?php echo $row['nom']; ?></td>
        <td><?php echo $row['description']; ?></td>
        <td><?php echo $row['prix']; ?> $</td>
        <td><?php echo $row['quantite']; ?></td>
        <td>
            <a href="?supprimer=<?php echo $row['id']; ?>">Supprimer</a> |
            <a href="#" onclick="editArticle(<?php echo htmlspecialchars(json_encode($row)); ?>)">Modifier</a>
        </td>
    </tr>
    <?php endwhile; ?>
</table>

<!-- ✅ FORMULAIRE DE MODIFICATION (Caché au début) -->
<form id="formModifier" method="post" enctype="multipart/form-data" style="display:none;">
    <h3>Modifier l’article</h3>
    <input type="hidden" name="id" id="edit_id">
    <input type="text" name="nom" id="edit_nom" placeholder="Nom" required>
    <textarea name="description" id="edit_description" placeholder="Description" required></textarea>
    <input type="number" name="prix" id="edit_prix" placeholder="Prix ($)" step="0.01" required>
    <input type="file" name="image" accept="image/*">
    <button type="submit" name="modifier">Sauvegarder les modifications</button>
</form>

<script>
function editArticle(article) {
    document.getElementById('formModifier').style.display = 'block';
    document.getElementById('edit_id').value = article.id;
    document.getElementById('edit_nom').value = article.nom;
    document.getElementById('edit_description').value = article.description;
    document.getElementById('edit_prix').value = article.prix;
    window.scrollTo(0, document.getElementById('formModifier').offsetTop);
}
</script>

</body>
</html>