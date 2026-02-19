<script>
  let { form } = $props();
</script>

<div class="container d-flex justify-content-center align-items-center" style="min-height: 70vh;">
  <div class="card shadow-sm" style="max-width: 480px; width: 100%;">
    <div class="card-body p-4">
      <h3 class="card-title text-center mb-4">
        <i class="bi bi-person-plus me-2"></i>
        Register
      </h3>

      {#if form?.errors?.general}
        <div class="alert alert-danger">
          {form.errors.general}
        </div>
      {/if}

      <form method="post" action="?/register">
        <!-- Username Field -->
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            name="username"
            class="form-control"
            required
          />
        </div>

        <!-- Password Field -->
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

        <!-- First Name Field -->
        <div class="mb-3">
          <label for="firstname" class="form-label">First Name</label>
          <input
            id="firstname"
            name="firstname"
            class="form-control"
            required
          />
        </div>

        <!-- Surname Field -->
        <div class="mb-3">
          <label for="surname" class="form-label">Surname</label>
          <input
            id="surname"
            name="surname"
            class="form-control"
            required
          />
        </div>

        <!-- Date of Birth Field -->
        <div class="mb-3">
          <label for="dob" class="form-label">Date of Birth</label>
          <input
            id="dob"
            type="date"
            name="dob"
            class="form-control"
            required
          />
        </div>

        <!-- Email Field -->
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            class="form-control"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">
          <i class="bi bi-person-plus me-1"></i> Register
        </button>
      </form>

      {#if form?.errors}
        <ul style="color: red" class="mt-3">
          {#each Object.entries(form.errors) as [field, message]}
            <li>{message}</li>
          {/each}
        </ul>
      {/if}

      <hr class="my-4" />

      <p class="text-center mb-0">
        Already have an account?
        <a href="/auth/login">Login</a>
      </p>
    </div>
  </div>
</div>