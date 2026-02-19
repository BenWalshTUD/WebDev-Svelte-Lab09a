<script>
  let { data } = $props();
  const { order } = data;

  const euro = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR'
  });
</script>

<h2>Order Confirmed</h2>

<p>Thank you for your order. Your order ID is <strong>#{order.id}</strong>.</p>
<p><strong>Total:</strong> {euro.format(order.total / 100)}</p>
<p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

<a href="/orders" class="btn btn-primary">View all orders</a>