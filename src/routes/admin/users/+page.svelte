<script>
    // get data that was returned when the page was loaded
    let { data } = $props();
    
    // get the users data
    let users = $state(data.users);

    // Svelte 5 introduces $inspect(), which is for debugging reactive state.
    // this is instead of console.log
    $inspect(users);

</script>

<h1 class="mb-4">Users</h1>

<div class="accordion w-75" id="userAccordion">
    {#each users as user, i}
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse{i}">
                    
                    {user.firstname} {user.surname} (@{user.username})
                </button>
            </h2>

            <div
                id="collapse{i}"
                class="accordion-collapse collapse"
                data-bs-parent="#userAccordion">
                
                <div class="accordion-body">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>DOB:</strong> {user.dob}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            </div>
        </div>
    {/each}
</div>