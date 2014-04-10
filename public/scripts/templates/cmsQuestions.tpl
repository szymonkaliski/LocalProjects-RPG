<div class="container">
	<% if (game) { %> 
		<h2>Questions for game: <%= game.get("name") %></h2>
	<% } else { %>
		<h2>All questions</h2>
	<% } %>

	<form class="form-inline" role="form">
		<div class="form-group">
			<label>New question:</label>
			<input type="text" class="form-control" id="question-name">
		</div>
		<button type="submit" class="question-add btn btn-default">Add</button>
	</form>

	<ul class="question-list">
	</ul>
</div>

