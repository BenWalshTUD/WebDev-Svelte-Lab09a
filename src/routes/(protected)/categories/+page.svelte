<script>
    // get data that was returned when the page was loaded
    let { data } = $props();
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
            {#each data.categories as category}
                <tr>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>