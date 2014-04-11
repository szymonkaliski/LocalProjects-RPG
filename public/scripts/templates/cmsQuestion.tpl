<h3><%= model.get("name") %></h3>

<button type="button" class="btn btn-default btn-xs question-remove">
	<span class="glyphicon glyphicon-remove"></span>
</button>

<form class="form-inline" role="form">
	<div class="form-group">
		<label>New token:</label>
		<input type="text" class="form-control token-name">
	</div>

	<button type="submit" class="token-add-new btn btn-default">Add new token</button>
</form>

<% if (tokens.length > 0) { %>
	<form class="form-inline" role="form">
		<div class="form-group">
			<label>Token:</label>
			<select class="form-control">
				<% tokens.forEach(function(token) { %>
					<option data-id="<%= token.id %>"><%= token.get("name") %></option>
				<% }) %>
			</select>
		</div>
		<button type="submit" class="token-add btn btn-default">Add</button>
	</form>
<% } %>

<ul class="tokens-list">
</ul>
