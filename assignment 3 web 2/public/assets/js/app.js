(function () {
  const CART_KEY = 'shop_cart';

  // CART LOGIC 
  function getCart() {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartCount();
  }

  function formatCurrency(num) {
    const n = Number(num || 0);
    return '₸ ' + n.toLocaleString('en-US');
  }

  function updateCartCount() {
    const items = getCart();
    let totalCount = 0;
    for (const item of items) {
      totalCount += Number(item.qty || 0);
    }
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = String(totalCount);
    }
  }

  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(function (item) {
      return item.id === product.id;
    });

    if (existing) {
      existing.qty += product.qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: Number(product.qty)
      });
    }

    saveCart(cart);
  }

  function removeFromCart(id) {
    const newCart = getCart().filter(function (item) {
      return item.id !== id;
    });
    saveCart(newCart);
  }

  function updateQty(id, qty) {
    const cart = getCart();
    for (const item of cart) {
      if (item.id === id) {
        item.qty = Math.max(1, Number(qty || 1));
      }
    }
    saveCart(cart);
  }

  // NAVBAR + YEAR
  function initNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.navbar .nav-link');

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
      }
    });

    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // PRODUCTS PAGE
  function initProductsPage() {
    const cards = $('.product-card');
    cards.hide();
    cards.each(function (i) {
      $(this).delay(100 * i).fadeIn(200);
    });

    // Add to cart
    $(document).on('click', '.add-to-cart', function () {
      const button = $(this);
      const product = {
        id: button.data('id'),
        name: button.data('name'),
        price: button.data('price'),
        qty: 1
      };
      addToCart(product);

      button.addClass('btn-success').removeClass('btn-primary').text('Added');
      setTimeout(function () {
        button.addClass('btn-primary').removeClass('btn-success').text('Add to Cart');
      }, 1200);
    });

    // Filters
    $('#toggle-filters').on('click', function () {
      $('#filters-panel').slideToggle(150);
    });

    $('.filter-checkbox').on('change', function () {
      const activeCategories = $('.filter-checkbox:checked')
        .map(function (_, el) {
          return el.value;
        })
        .get();

      $('.product-card').each(function () {
        const category = $(this).data('category');
        if (activeCategories.includes(category)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  }

  // CART PAGE
  function renderCart() {
    const items = getCart();
    const body = $('#cart-items');
    body.empty();

    let subtotal = 0;

    items.forEach(function (item) {
      const lineTotal = item.price * item.qty;
      subtotal += lineTotal;

      const row = `
        <tr>
          <td>${item.name}</td>
          <td class="text-center">${formatCurrency(item.price)}</td>
          <td class="text-center" style="max-width:120px;">
            <input type="number" min="1" class="form-control form-control-sm cart-qty" data-id="${item.id}" value="${item.qty}">
          </td>
          <td class="text-end">${formatCurrency(lineTotal)}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-danger cart-remove" data-id="${item.id}">Remove</button>
          </td>
        </tr>
      `;
      body.append(row);
    });

    $('#cart-subtotal').text(formatCurrency(subtotal));
    $('#cart-total').text(formatCurrency(subtotal));

    // Quantity change
    $(document).off('change.cart').on('change.cart', '.cart-qty', function () {
      const id = $(this).data('id');
      const qty = Number($(this).val());
      updateQty(id, qty);
      renderCart();
    });

    // Remove item
    $(document).off('click.remove').on('click.remove', '.cart-remove', function () {
      const id = $(this).data('id');
      removeFromCart(id);
      renderCart(); 
    });

    // Clear all
    $('#clear-cart').off('click').on('click', function () {
      saveCart([]);
      renderCart();
    });
  }

  // CHECKOUT PAGE
  function initCheckout() {
    const items = getCart();
    const list = $('#checkout-summary');
    list.empty();

    let total = 0;
    items.forEach(function (item) {
      const line = item.price * item.qty;
      total += line;
      const li = `
        <li class="list-group-item d-flex justify-content-between">
          <span>${item.name} × ${item.qty}</span>
          <span>${formatCurrency(line)}</span>
        </li>
      `;
      list.append(li);
    });
    $('#checkout-total').text(formatCurrency(total));

    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const payChecked = document.querySelector('input[name="payMethod"]:checked');
      const payInvalid = document.getElementById('pay-invalid');

      if (!payChecked) {
        payInvalid.style.display = 'block';
        return;
      } else {
        payInvalid.style.display = 'none';
      }

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      if (getCart().length === 0) {
        alert('Your cart is empty.');
        return;
      }

      const customerName = document.getElementById('name').value;
      const customerEmail = document.getElementById('email').value;
      const customerAddress = document.getElementById('address').value;
      const customerCity = document.getElementById('city').value;
      const customerZip = document.getElementById('zip').value;
      const paymentMethod = payChecked.value;

      let orderDetails = '';
      items.forEach(function(item) {
        orderDetails += `${item.name} × ${item.qty} = ${formatCurrency(item.price * item.qty)}\n`;
      });

      const shippingAddress = `${customerAddress}, ${customerCity}, ${customerZip}`;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';

      // Initialize EmailJS
      if (window.emailjs && typeof window.emailjs.init === 'function') {
        emailjs.init('_X_BHlZmmaOTmJlN7');
      }

      // Send  EmailJS
      if (window.emailjs && typeof window.emailjs.send === 'function') {
        emailjs.send('service_mcrr0ml', 'template_gp880rr', { 
          to_email: customerEmail,
          to_name: customerName,
          order_details: orderDetails,
          order_total: formatCurrency(total),
          shipping_address: shippingAddress,
          payment_method: paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'
        })
        .then(function(response) {
          console.log('Order email sent!', response);
          alert(`Thank you, ${customerName}!\n\nYour order has been placed successfully.\nConfirmation email sent to ${customerEmail}`);
          saveCart([]);
          form.reset();
          form.classList.remove('was-validated');
          window.location.href = 'index.html';
        })
        .catch(function(error) {
          console.error('Email send error:', error);
          alert('Error: ' + error.text + '\n\nPlease contact support.');
        })
        .finally(function() {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
      } else {
        alert('EmailJS not loaded. Please refresh the page.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }


  // Send confirmation email via EmailJS 
  function sendConfirmationEmail(params) {
    return new Promise(function (resolve, reject) {
      // Initialize EmailJS 
      try {
        if (window.emailjs && typeof window.emailjs.init === 'function') {
          window.emailjs.init(params.publicKey);
        }
      } catch (e) {
        // ignore
      }

      const templateParams = {
        to_email: params.to_email,
        to_name: params.to_name,
        order_details: params.order_details,
        order_total: params.order_total,
        shipping_address: params.shipping_address
      }; // prepare template params

      // Attempt to send via EmailJS
      if (window.emailjs && typeof window.emailjs.send === 'function') {
        window.emailjs.send(params.serviceId, params.templateId, templateParams)
          .then(function (response) {
            resolve(response);
          }, function (error) {
            // if emailjs returns error — try fallback
            try {
              fallbackMailto(templateParams);
              resolve({ fallback: true });
            } catch (e) {
              reject(error);
            }
          });
      } else {
        // EmailJS SDK not available
        try {
          fallbackMailto(templateParams);
          resolve({ fallback: true });
        } catch (e) {
          reject(e);
        }
      }
    });
  }

  function fallbackMailto(p) {
    const subject = encodeURIComponent('Your ShopLite Order — Confirmation');
    const body = encodeURIComponent(
      `Hello ${p.to_name || ''},\n\n` +
      `Thank you for your purchase! Here are your order details:\n\n` +
      `${p.order_details}\n` +
      `Total: ${p.order_total}\n\n` +
      `Shipping address: ${p.shipping_address}\n\n` +
      `Best regards,\nShopLite`
    );
    // will open the user's mail client to send the message 
    window.location.href = `mailto:${encodeURIComponent(p.to_email)}?subject=${subject}&body=${body}`;
  }

  // SCROLL TO TOP
  function initScrollTop() {
    const button = document.createElement('button');
    button.id = 'scrollTopBtn';
    button.className = 'btn btn-primary btn-sm';
    button.textContent = 'Top';
    button.style.display = 'none';
    document.body.appendChild(button);

    $(window).on('scroll', function () {
      if (window.scrollY > 200) {
        $(button).fadeIn(150);
      } else {
        $(button).fadeOut(150);
      }
    });

    $(button).on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 250);
    });
  }

  // BOOT
  $(function () {
    initNav();
    updateCartCount();
    initScrollTop();

    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

    if (page === 'products.html') {
      initProductsPage();
    }
    if (page === 'cart.html') {
      renderCart();
    }
    if (page === 'checkout.html') {
      initCheckout();
    }
  });

  // DARK MODE
  const modeToggle = document.getElementById('mode-toggle');

  if (modeToggle) {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      modeToggle.textContent = 'Light';
    } else {
      modeToggle.textContent = 'Dark';
    }

    modeToggle.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark-mode');
      const isDark = document.documentElement.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      modeToggle.textContent = isDark ? 'Light' : 'Dark';
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    const yearEls = document.querySelectorAll('#site-year');
    yearEls.forEach(e => e.textContent = new Date().getFullYear());
  });

})();
