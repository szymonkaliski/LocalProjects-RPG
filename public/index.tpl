<!DOCTYPE html>
<html>
	<head>
		<title>Local Projects RPG</title>

		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<link rel="stylesheet" type="text/css" href="/styles/style.css"/>
	</head>
	<body>
		<!-- @if BUILD_ENV == 'DEVELOPMENT' -->
		<script data-main="scripts/app" src="scripts/libraries/require.js"></script>
		<!-- @endif -->

		<!-- @if BUILD_ENV == 'PRODUCTION' -->
		<script src="scripts/LocalProjectsRPG.min.js"></script>
		<!-- @endif -->
	</body>
</html>
