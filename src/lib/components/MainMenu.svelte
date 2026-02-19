<script>
    import { ROLES } from '$lib/constants/roles.js';
    
    let { data } = $props();
</script>

<!-- Header with Navbar -->
<header class="navbar navbar-expand-md navbar-dark bd-navbar bg-dark">
  <nav class="container-xl flex-wrap flex-md-nowrap" aria-label="Main navigation">
		<div class="container-fluid main-wrapper">
			<a class="navbar-brand" href="/">
				<i class="bi bi-code-square me-2"></i>Lab 9A
			</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bdNavbar" aria-controls="bdNavbar" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav me-auto">
					<li class="nav-item">
						<a class="nav-link active" href="/"><i class="bi bi-house me-1"></i>Home</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/about"><i class="bi bi-info-circle me-1"></i>About</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/contact"><i class="bi bi-envelope me-1"></i>Contact</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/products"><i class="bi bi-shop me-1"></i>Products</a>
					</li>
					{#if data.user && data.user.role === ROLES.MANAGER}
						<li class="nav-item">
							<a class="nav-link" href="/categories"><i class="bi bi-list-columns me-1"></i>Categories</a>
						</li>
					{/if}
					<li class="nav-item">
						<a class="nav-link" href="/orders"><i class="bi bi-receipt me-1"></i>Orders</a>
					</li>
					{#if data.user}
						<li class="nav-item dropdown">
							<button class="nav-link dropdown-toggle btn btn-link" type="button" data-bs-toggle="dropdown">
  								<i class="bi bi-person-circle me-1"></i>{data.user.firstname} ({data.user.role})
							</button>
							<ul class="dropdown-menu dropdown-menu-end">
								<li><a class="dropdown-item" href="/account"><i class="bi bi-person me-1"></i>Profile</a></li>
								<li><hr class="dropdown-divider" /></li>
								<li>
									<form method="post" action="/auth/logout">
										<button class="dropdown-item text-danger" type="submit">
											<i class="bi bi-box-arrow-right me-1"></i>Logout
										</button>
									</form>
								</li>
							</ul>
						</li>
					{:else}
					<li class="nav-item">
						<a class="nav-link" href="/auth/login"><i class="bi bi-box-arrow-in-right me-1"></i>Login</a>
					</li>
					{/if}
					{#if data.user && data.cartCount > 0}
						<li class="nav-item">
							<a class="nav-link" href="/cart"><i class="bi bi-cart me-1"></i>Cart</a>
						</li>
					{/if}
				</ul>
			</div>
		</div>
	</nav>
</header>