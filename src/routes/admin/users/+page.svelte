<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	// row currently being edited
	let editingId = $state(null);

	// page-level errors (create/update/reset)
	let pageError = $state('');

	/* =========================
	   Edit mode helpers
	========================= */
	function edit(id) {
		editingId = id;
		pageError = '';
	}

	function cancel() {
		editingId = null;
		pageError = '';
	}

	/* =========================
	   Generic enhanced handler
	   - success: close edit + refresh
	   - failure: show error
	========================= */
	function enhanced() {
		return async ({ result }) => {
			if (!result) return;

			if (result.type === 'success') {
				pageError = '';
				editingId = null;
				await invalidateAll();
			}

			if (result.type === 'failure') {
				pageError = result.data?.errors?.general || 'Operation failed';
			}
		};
	}

	/* =========================
	   Delete modal
	========================= */
	let userToDelete = $state(null);
	let showDeleteModal = $state(false);
	let modalDeleteError = $state('');

	function openDeleteModal(user) {
		userToDelete = user;
		showDeleteModal = true;
		modalDeleteError = '';
		pageError = '';
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		userToDelete = null;
		modalDeleteError = '';
	}

	function enhanceDeleteModal() {
		return async ({ result }) => {
			if (!result) return;

			if (result.type === 'success') {
				closeDeleteModal();
				await invalidateAll();
			}

			if (result.type === 'failure') {
				modalDeleteError =
					result.data?.errors?.general ||
					result.data?.message ||
					result.data?.error ||
					'Delete failed';
			}
		};
	}

	/* =========================
	   Reset password modal
	========================= */
	let userToReset = $state(null);
	let showResetModal = $state(false);
	let modalResetError = $state('');

	function openResetModal(user) {
		userToReset = user;
		showResetModal = true;
		modalResetError = '';
		pageError = '';
	}

	function closeResetModal() {
		showResetModal = false;
		userToReset = null;
		modalResetError = '';
	}

	function enhanceResetModal() {
		return async ({ result }) => {
			if (!result) return;

			if (result.type === 'success') {
				closeResetModal();
				await invalidateAll();
			}

			if (result.type === 'failure') {
				modalResetError =
					result.data?.errors?.general ||
					result.data?.message ||
					result.data?.error ||
					'Password reset failed';
			}
		};
	}
</script>

<h3>Users</h3>

{#if pageError}
	<div class="alert alert-danger">{pageError}</div>
{/if}

<table class="table table-bordered w-100">
	<thead>
		<tr>
			<th>ID</th>
			<th>Username</th>
			<th>Firstname</th>
			<th>Surname</th>
			<th>DOB</th>
			<th>Email</th>
			<th>Role</th>
			<th>Actions</th>
		</tr>
	</thead>

	<tbody>
		{#each data.users as u (u.id)}
			<tr>
				<td>{u.id}</td>

				<td>
					{#if editingId === u.id}
						<input class="form-control" name="username" form={`edit-${u.id}`} value={u.username} required />
					{:else}
						{u.username}
					{/if}
				</td>

				<td>
					{#if editingId === u.id}
						<input class="form-control" name="firstname" form={`edit-${u.id}`} value={u.firstname} required />
					{:else}
						{u.firstname}
					{/if}
				</td>

				<td>
					{#if editingId === u.id}
						<input class="form-control" name="surname" form={`edit-${u.id}`} value={u.surname} required />
					{:else}
						{u.surname}
					{/if}
				</td>

				<td>
					{#if editingId === u.id}
						<input class="form-control" name="dob" form={`edit-${u.id}`} value={u.dob} required />
					{:else}
						{u.dob}
					{/if}
				</td>

				<td>
					{#if editingId === u.id}
						<input class="form-control" name="email" type="email" form={`edit-${u.id}`} value={u.email} required />
					{:else}
						{u.email}
					{/if}
				</td>

				<td>
					{#if editingId === u.id}
						<select class="form-select" name="role" form={`edit-${u.id}`}>
							<option value="user" selected={u.role === 'user'}>user</option>
							<option value="admin" selected={u.role === 'admin'}>admin</option>
						</select>
					{:else}
						{u.role}
					{/if}
				</td>

				<td>
					{#if editingId === u.id}
						<!-- UPDATE USER FORM -->
						<form
							id={`edit-${u.id}`}
							method="POST"
							action="?/updateUser"
							use:enhance={enhanced}
							class="d-inline"
						>
							<input type="hidden" name="id" value={u.id} />
							<button type="submit" class="btn btn-sm btn-success">✓</button>
							<button type="button" class="btn btn-sm btn-secondary ms-1" onclick={cancel}>✕</button>
						</form>
					{:else}
						<!-- EDIT -->
						<button type="button" class="btn btn-sm btn-outline-primary" onclick={() => edit(u.id)}>✎</button>

						<!-- RESET PASSWORD (modal) -->
						<button
							type="button"
							class="btn btn-sm btn-outline-warning ms-1"
							onclick={() => openResetModal(u)}
							title="Reset password"
						>
							🔑
						</button>

						<!-- DELETE (modal) -->
						<button
							type="button"
							class="btn btn-sm btn-outline-danger ms-1"
							onclick={() => openDeleteModal(u)}
						>
							🗑
						</button>
					{/if}
				</td>
			</tr>
		{/each}

		<!-- ADD NEW USER -->
		<tr>
			<td>new</td>

			<td><input class="form-control" name="username" form="create-user" required /></td>
			<td><input class="form-control" name="firstname" form="create-user" required /></td>
			<td><input class="form-control" name="surname" form="create-user" required /></td>
			<td><input class="form-control" name="dob" form="create-user" placeholder="YYYY-MM-DD" required /></td>
			<td><input class="form-control" name="email" type="email" form="create-user" required /></td>
			<td>
				<select class="form-select" name="role" form="create-user">
					<option value="user">user</option>
					<option value="admin">admin</option>
				</select>
			</td>

			<td>
				<form
					id="create-user"
					method="POST"
					action="?/createUser"
					use:enhance={async ({ result }) => {
						if (!result) return;

						if (result.type === 'success') {
							pageError = '';
							await invalidateAll();
						}

						if (result.type === 'failure') {
							pageError = result.data?.errors?.general || 'Create failed';
						}
					}}
					class="d-inline"
				>
					<!-- password field lives in the form but doesn't need a table column -->
					<input class="form-control mt-2" name="password" type="password" placeholder="password" required />

					<button type="submit" class="btn btn-sm btn-success mt-2">+</button>
				</form>
			</td>
		</tr>
	</tbody>
</table>

<!-- =========================
     DELETE CONFIRMATION MODAL
     ========================= -->
{#if showDeleteModal}
	<div class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5); z-index: 1050;" role="dialog" aria-modal="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header bg-danger text-white">
					<h5 class="modal-title">Confirm Delete</h5>
					<button type="button" class="btn-close" aria-label="Close" onclick={closeDeleteModal}></button>
				</div>

				<div class="modal-body">
					<p>
						Are you sure you want to delete
						<strong>{userToDelete?.username}</strong>?
					</p>

					{#if modalDeleteError}
						<div class="alert alert-danger mt-3">{modalDeleteError}</div>
					{/if}
				</div>

				<div class="modal-footer">
					<form method="POST" action="?/deleteUser" use:enhance={enhanceDeleteModal} class="d-inline">
						<input type="hidden" name="id" value={userToDelete?.id} />
						<button type="submit" class="btn btn-danger">Yes, Delete</button>
					</form>

					<button type="button" class="btn btn-secondary" onclick={closeDeleteModal}>Cancel</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- =========================
     RESET PASSWORD MODAL
     ========================= -->
{#if showResetModal}
	<div class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5); z-index: 1050;" role="dialog" aria-modal="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header bg-warning">
					<h5 class="modal-title">Reset Password</h5>
					<button type="button" class="btn-close" aria-label="Close" onclick={closeResetModal}></button>
				</div>

				<div class="modal-body">
					<p>
						Set a new password for <strong>{userToReset?.username}</strong>
					</p>

					{#if modalResetError}
						<div class="alert alert-danger mt-3">{modalResetError}</div>
					{/if}
				</div>

				<div class="modal-footer">
					<form method="POST" action="?/resetPassword" use:enhance={enhanceResetModal} class="d-inline">
						<input type="hidden" name="id" value={userToReset?.id} />
						<input class="form-control" name="password" type="password" placeholder="new password" required />
						<button type="submit" class="btn btn-warning ms-2">Reset</button>
					</form>

					<button type="button" class="btn btn-secondary" onclick={closeResetModal}>Cancel</button>
				</div>
			</div>
		</div>
	</div>
{/if}