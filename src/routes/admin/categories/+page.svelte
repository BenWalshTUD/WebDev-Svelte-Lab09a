<script>
    // enhance() allows forms to submit without a full page reload (AJAX style)
    import { enhance } from '$app/forms';

    // invalidateAll() tells SvelteKit to re-run load() and refresh server data
    import { invalidateAll } from '$app/navigation';

    // data returned from +page.server.js load() function
    let { data } = $props();

    // stores the id of the category currently being edited
    // null means no category is in edit mode
    let editingId = $state(null);

    // holds any page-level error message returned from the server (e.g., update failed)
    // (we keep this for non-modal operations)
    let deleteError = $state('');

    /* =========================
       Edit mode helpers
    ========================== */

    // Enter edit mode for a specific category
    function edit(id) {
        editingId = id;     // remember which row is being edited
        deleteError = '';   // clear any previous page-level errors
    }

    // Cancel editing and return to normal display
    function cancel() {
        editingId = null;   // exit edit mode
        deleteError = '';   // clear errors
    }

    /* =========================
       Enhanced form handler
       Used by UPDATE form (and could be used elsewhere)
    ========================== */

    // Called automatically after a form enhanced with use:enhance finishes
    function enhanced() {
        return async ({ result }) => {

            // If server action succeeded
            if (result?.type === 'success') {
                deleteError = '';      // clear error messages
                editingId = null;      // exit edit mode

                // reload data from the server so UI matches database
                await invalidateAll();
            }

            // If server action failed
            if (result?.type === 'failure') {
                // display server validation error if provided
                deleteError = result.data?.errors?.general || 'Operation failed';
            }
        };
    }

    /* =========================
       Modal Popup (Delete)
    ========================== */

    // Track which category is pending deletion
    let categoryToDelete = $state(null);

    // Whether the modal is visible
    let showDeleteModal = $state(false);

    // Modal-specific error shown inside the delete modal
    let modalDeleteError = $state('');

    // Open modal and remember which category user wants to delete
    function openDeleteModal(category) {
        categoryToDelete = category;
        showDeleteModal = true;
        modalDeleteError = ''; // clear modal error each time
        deleteError = '';      // clear page-level error (optional)
    }

    // Close modal and clear selection/error
    function closeDeleteModal() {
        showDeleteModal = false;
        categoryToDelete = null;
        modalDeleteError = '';
    }

    // Dedicated enhance handler for the delete modal form
    // - On success: close modal and refresh data
    // - On failure: keep modal open and show error inside the modal
    function enhanceDeleteModal() {
        return async ({ result }) => {
            if (!result) return;

            if (result.type === 'success') {
                // close first so UI updates immediately
                closeDeleteModal();

                // refresh server data so table updates
                await invalidateAll();
            }

            if (result.type === 'failure') {
                // show server error inside modal (fallback if not provided)
                modalDeleteError =
                    result.data?.errors?.general ||
                    result.data?.message ||
                    result.data?.error ||
                    'Delete failed';
            }
        };
    }
</script>

<h3>Categories</h3>

<!-- Page-level error (for non-modal operations like update/create) -->
{#if deleteError}
    <div class="alert alert-danger">{deleteError}</div>
{/if}

<table class="table table-bordered w-75">
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
    </thead>

    <tbody>
        <!-- Loop through categories returned from the server -->
        {#each data.prodCategories as category (category.id)}
            <tr>
                <td>{category.id}</td>

                <!-- CATEGORY NAME -->
                <td>
                    {#if editingId === category.id}
                        <!-- If editing: show input field -->
                        <input
                            class="form-control"
                            name="catName"
                            form={`edit-${category.id}`}
                            value={category.name}
                            required
                        />
                    {:else}
                        <!-- Otherwise just display text -->
                        {category.name}
                    {/if}
                </td>

                <!-- CATEGORY DESCRIPTION -->
                <td>
                    {#if editingId === category.id}
                        <input
                            class="form-control"
                            name="catDesc"
                            form={`edit-${category.id}`}
                            value={category.description}
                            required
                        />
                    {:else}
                        {category.description}
                    {/if}
                </td>

                <td>
                    {#if editingId === category.id}

                        <!-- UPDATE CATEGORY FORM -->
                        <form
                            id={`edit-${category.id}`}
                            method="POST"
                            action="?/updateCategory"
                            use:enhance={enhanced}
                            class="d-inline"
                        >
                            <!-- hidden field sends category id to server -->
                            <input type="hidden" name="catId" value={category.id} />

                            <!-- submit changes -->
                            <button type="submit" class="btn btn-sm btn-success">✓</button>

                            <!-- cancel editing -->
                            <button
                                type="button"
                                class="btn btn-sm btn-secondary ms-1"
                                onclick={cancel}
                            >
                                ✕
                            </button>
                        </form>

                    {:else}

                        <!-- EDIT BUTTON -->
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary"
                            onclick={() => edit(category.id)}
                        >
                            ✎
                        </button>

                        <!-- DELETE BUTTON (opens modal; does NOT submit a form) -->
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-danger ms-1"
                            onclick={() => openDeleteModal(category)}
                        >
                            🗑
                        </button>

                    {/if}
                </td>
            </tr>
        {/each}

        <!-- ADD NEW CATEGORY -->
        <tr>
            <td>new</td>
            <td>
                <input
                    class="form-control"
                    name="catName"
                    form="create-category"
                    required
                />
            </td>
            <td>
                <input
                    class="form-control"
                    name="catDesc"
                    form="create-category"
                    required
                />
            </td>
            <td>
                <form
                    id="create-category"
                    method="POST"
                    action="?/createCategory"
                    use:enhance={async ({ result }) => {
                        if (result?.type === 'success') {
                            // NOTE: Leaving as-is to avoid changing behaviour in your working page.
                            // These variables must exist somewhere in your component if you want to clear inputs.
                            newName.value = '';
                            newDesc.value = '';
                            await invalidateAll();
                        }

                        if (result?.type === 'failure') {
                            deleteError = result.data?.errors?.general || 'Create failed';
                        }
                    }}
                >
                    <button type="submit" class="btn btn-sm btn-success">+</button>
                </form>
            </td>
        </tr>
    </tbody>
</table>

<!-- =========================
     DELETE CONFIRMATION MODAL
     ========================= -->
{#if showDeleteModal}
    <div
        class="modal d-block"
        tabindex="-1"
        style="background: rgba(0,0,0,0.5); z-index: 1050;"
        role="dialog"
        aria-modal="true"
    >
        <div class="modal-dialog" role="document">
            <div class="modal-content">

                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">Confirm Delete</h5>
                    <button
                        type="button"
                        class="btn-close"
                        aria-label="Close"
                        onclick={closeDeleteModal}
                    ></button>
                </div>

                <div class="modal-body">
                    <p>
                        Are you sure you want to delete
                        <strong>{categoryToDelete?.name}</strong>?
                    </p>

                    <!-- Modal-specific error (e.g., foreign key constraint) -->
                    {#if modalDeleteError}
                        <div class="alert alert-danger mt-3">{modalDeleteError}</div>
                    {/if}
                </div>

                <div class="modal-footer">
                    <!-- REAL delete form lives in the modal -->
                    <form
                        method="POST"
                        action="?/deleteCategory"
                        use:enhance={enhanceDeleteModal}
                        class="d-inline"
                    >
                        <input type="hidden" name="catId" value={categoryToDelete?.id} />
                        <button type="submit" class="btn btn-danger">Yes, Delete</button>
                    </form>

                    <button
                        type="button"
                        class="btn btn-secondary"
                        onclick={closeDeleteModal}
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    </div>
{/if}