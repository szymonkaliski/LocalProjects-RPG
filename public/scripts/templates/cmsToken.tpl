<h4><%= model.get("name") %></h4>

<% if (impact !== undefined) { %>
	<form class="form-inline" role="form">
		<div class="form-group">
			<label>Impact</label>
			<input type="number" class="form-control impact" value="<%= impact %>">
		</div>
	</form>
<% } %>

<button type="button" class="btn btn-default btn-xs token-edit">
	<span class="glyphicon glyphicon-edit"></span>
</button>

<button type="button" class="btn btn-default btn-xs token-remove">
	<span class="glyphicon glyphicon-remove"></span>
</button>

<div class="modal fade">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title">Edit token</h4>
			</div>
			<div class="modal-body">
				<form class="form-inline" role="form">
					<div class="form-group">
						<label>Name</label>
						<input type="text" class="form-control name" value="<%= model.get('name') %>">
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary token-save">Save changes</button>
			</div>
		</div>
	</div>
</div>
