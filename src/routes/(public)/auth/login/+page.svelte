<script>
  let { form } = $props();
</script>

<div class="container d-flex justify-content-center align-items-center" style="min-height: 70vh;">
  <div class="card shadow-sm" style="max-width: 420px; width: 100%;">
    <div class="card-body p-4">
      <h3 class="card-title text-center mb-4">
        <i class="bi bi-box-arrow-in-right me-2"></i>
        Login
      </h3>

      {#if form?.errors?.general}
        <div class="alert alert-danger">
          {form.errors.general}
        </div>
      {/if}

      <form method="post" action="?/login">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            name="username"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            class="form-control"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">
          <i class="bi bi-box-arrow-in-right me-1"></i>
          Login
        </button>
      </form>

      <hr class="my-4" />

      <p class="text-center mb-0">
        Don’t have an account?
        <a href="/auth/register">Register</a>
      </p>
    </div>
  </div>
</div>