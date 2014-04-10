<%= model.get("name") %>

<button type="button" class="btn btn-default btn-xs question-remove">
	<span class="glyphicon glyphicon-remove"></span>
</button>

<% if (tokens.length > 0) { %>
	<form class="form-inline" role="form">
		<div class="form-group">
			<label>Token id:</label>
			<select class="form-control">
				<% tokens.forEach(function(token) { %>
					<option data-id="<%= token.id %>"><%= token.get("name") %></option>
				<% }) %>
			</select>
		</div>
		<button type="submit" class="question-add btn btn-default">Add</button>
	</form>
<% } %>

<ul class="tokens-list">
</ul>
