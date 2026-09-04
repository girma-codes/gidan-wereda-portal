<?php
// PHP integration bridge for the existing PHP/MVC portal.
// React owns the UI; this include only provides shared document metadata.
$pageTitle = $pageTitle ?? 'Gidan Wereda Digital Service Portal';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= htmlspecialchars($pageTitle) ?></title>
</head>
<body>
  <div id="root"></div>
