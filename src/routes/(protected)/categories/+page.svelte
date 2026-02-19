<script>
    // get data that was returned when the page was loaded
    let { data } = $props();
    
    // get the location data
    let categories = $state(data.prodCategories);

    // Svelte 5 introduces $inspect(), which is for debugging reactive state.
    // this is instead of console.log
    //$inspect(categories);

</script>

<h3>Categories</h3>

<section>
    <table class="table table-bordered table-hover w-75">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <!-- iterate over categories, adding a new table row for each category -->
            {#each categories as category}
                <tr>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>