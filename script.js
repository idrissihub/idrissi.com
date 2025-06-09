// Global Variables
let cart = JSON.parse(localStorage.getItem("cart")) || []
let currentPage = "home"
let testimonialInterval
const particles = []
let canvas, ctx
const currentStep = 1

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add this function to the script.js file to handle the hamburger menu animation
  // Add this right after the document.addEventListener("DOMContentLoaded", () => { line

  initializeApp()
  // Payment method selection
  const paymentOptions = document.querySelectorAll(".payment-option")

  paymentOptions.forEach((option) => {
    const radio = option.querySelector('input[type="radio"]')

    option.addEventListener("click", () => {
      paymentOptions.forEach((opt) => opt.classList.remove("active"))
      option.classList.add("active")
      radio.checked = true
    })

    radio.addEventListener("change", () => {
      paymentOptions.forEach((opt) => opt.classList.remove("active"))
      option.classList.add("active")
    })
  })
})

// Update the initializeApp function to include search initialization

function initializeApp() {
  initializeParticles()
  initializeNavigation()
  initializeSearch() // Add this line
  initializeCounters()
  initializeServiceFilters()
  initializeCart()
  initializeModals()
  initializeForms()
  initializeScrollAnimations()
  // Show home page by default
  showPage("home")

  // Add highlight effect style
  const highlightStyle = document.createElement("style")
  highlightStyle.textContent = `
  @keyframes highlightService {
    0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
  }
  
  .service-card-full.highlight {
    animation: highlightService 2s ease;
    border-color: var(--primary-purple);
  }
`
  document.head.appendChild(highlightStyle)
}

// Particle System
function initializeParticles() {
  canvas = document.getElementById("particleCanvas")
  if (!canvas) return

  ctx = canvas.getContext("2d")
  resizeCanvas()

  // Create particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    })
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(37, 99, 235, ${particle.opacity})`
      ctx.fill()
    })

    requestAnimationFrame(animate)
  }

  animate()

  window.addEventListener("resize", resizeCanvas)
}

// Resize Canvas
function resizeCanvas() {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

// Navigation Initialization
function initializeNavigation() {
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Hamburger menu toggle with animation
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      hamburger.classList.toggle("active") // Add this line for animation
    })
  }

  // Navigation link clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const href = link.getAttribute("href")
      const pageId = href.substring(1) // Remove #

      showPage(pageId)

      // Close mobile menu
      navMenu.classList.remove("active")
      hamburger.classList.remove("active") // Add this line for animation

      // Update active nav link
      navLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")
    })
  })
}

// Add search functionality after the initializeNavigation function

// Search Initialization
function initializeSearch() {
  const searchBtn = document.querySelector(".search-btn")
  const searchModal = document.getElementById("searchModal")
  const searchInput = document.getElementById("searchInput")
  const searchResults = document.getElementById("searchResults")
  const closeSearch = document.getElementById("closeSearch")

  // Search button click
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      searchModal.classList.add("active")
      searchInput.focus()
    })
  }

  // Close search modal
  if (closeSearch) {
    closeSearch.addEventListener("click", () => {
      searchModal.classList.remove("active")
      searchInput.value = ""
      searchResults.innerHTML = ""
    })
  }

  // Close search when clicking outside
  if (searchModal) {
    searchModal.addEventListener("click", (e) => {
      if (e.target === searchModal) {
        searchModal.classList.remove("active")
        searchInput.value = ""
        searchResults.innerHTML = ""
      }
    })
  }

  // Search input functionality
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase()
      if (query.length > 0) {
        performSearch(query)
      } else {
        searchResults.innerHTML = ""
      }
    })

    // Handle Enter key
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const firstResult = searchResults.querySelector(".search-result-item")
        if (firstResult) {
          firstResult.click()
        }
      }
    })
  }
}

// Search functionality
function performSearch(query) {
  const searchResults = document.getElementById("searchResults")

  // Define searchable services
  const services = [
    {
      id: "instagram-growth",
      name: "Instagram Growth Package",
      description: "Complete Instagram growth solution with followers, likes, views, and engagement boost",
      keywords: ["instagram", "followers", "likes", "social media", "growth", "engagement"],
      icon: "fab fa-instagram",
      iconClass: "instagram",
      action: () => showServiceDetails("instagram-growth"),
    },
    {
      id: "youtube-boost",
      name: "YouTube Channel Boost",
      description: "Grow your YouTube channel with subscribers, views, and watch time optimization",
      keywords: ["youtube", "subscribers", "views", "video", "channel", "boost"],
      icon: "fab fa-youtube",
      iconClass: "youtube",
      action: () => showServiceDetails("youtube-boost"),
    },
    {
      id: "facebook-marketing",
      name: "Facebook Marketing Suite",
      description: "Comprehensive Facebook marketing with page likes, post engagement, and reach",
      keywords: ["facebook", "marketing", "likes", "engagement", "social media"],
      icon: "fab fa-facebook",
      iconClass: "facebook",
      action: () => showServiceDetails("facebook-marketing"),
    },
    {
      id: "tiktok-viral",
      name: "TikTok Viral Package",
      description: "Make your TikTok content go viral with followers, likes, and views",
      keywords: ["tiktok", "viral", "followers", "likes", "views", "trending"],
      icon: "fas fa-users",
      iconClass: "tiktok",
      action: () => showServiceDetails("tiktok-viral"),
    },
    {
      id: "kick-growth",
      name: "Kick Streamer Growth",
      description: "Boost your Kick streaming with followers, viewers, and engagement",
      keywords: ["kick", "streaming", "followers", "viewers", "live"],
      icon: "fas fa-bolt",
      iconClass: "kick",
      action: () => showServiceDetails("kick-growth"),
    },
    {
      id: "office-suite",
      name: "Microsoft Office Suite",
      description: "Get premium Microsoft Office subscriptions at discounted rates",
      keywords: ["microsoft", "office", "word", "excel", "powerpoint", "productivity"],
      icon: "fas fa-file-alt",
      iconClass: "office",
      action: () => showServiceDetails("office-suite"),
    },
    {
      id: "canva-pro",
      name: "Canva Pro Subscription",
      description: "Unlock premium design tools with Canva Pro for stunning graphics",
      keywords: ["canva", "design", "graphics", "templates", "creative"],
      icon: "fas fa-palette",
      iconClass: "canva",
      action: () => showServiceDetails("canva-pro"),
    },
    {
      id: "netflix-premium",
      name: "Netflix Premium Subscription",
      description: "Get premium Netflix subscriptions with 4K streaming",
      keywords: ["netflix", "streaming", "movies", "shows", "entertainment", "4k"],
      icon: "fas fa-play",
      iconClass: "netflix",
      action: () => showServiceDetails("netflix-premium"),
    },
    {
      id: "spotify-premium",
      name: "Spotify Premium Subscription",
      description: "Get premium Spotify subscriptions with ad-free music streaming",
      keywords: ["spotify", "music", "streaming", "premium", "audio", "songs"],
      icon: "fas fa-music",
      iconClass: "spotify",
      action: () => showServiceDetails("spotify-premium"),
    },
  ]

  // Add pages to search
  const pages = [
    {
      id: "services",
      name: "Our Services",
      description: "Browse all our social media and digital services",
      keywords: ["services", "all services", "browse"],
      icon: "fas fa-th-large",
      iconClass: "services",
      action: () => showPage("services"),
    },
    {
      id: "about",
      name: "About Us",
      description: "Learn more about Idrissi and our mission",
      keywords: ["about", "company", "mission", "story"],
      icon: "fas fa-info-circle",
      iconClass: "about",
      action: () => showPage("about"),
    },
    {
      id: "contact",
      name: "Contact Us",
      description: "Get in touch with our team for support",
      keywords: ["contact", "support", "help", "message"],
      icon: "fas fa-envelope",
      iconClass: "contact",
      action: () => showPage("contact"),
    },
  ]

  const allItems = [...services, ...pages]

  // Filter results based on query
  const results = allItems.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(query)
    const descriptionMatch = item.description.toLowerCase().includes(query)
    const keywordMatch = item.keywords.some((keyword) => keyword.includes(query))

    return nameMatch || descriptionMatch || keywordMatch
  })

  // Display results
  if (results.length > 0) {
    searchResults.innerHTML = `
      <div class="search-results-header">
        <span>Found ${results.length} result${results.length !== 1 ? "s" : ""}</span>
      </div>
      ${results
        .map(
          (result) => `
        <div class="search-result-item" onclick="selectSearchResult('${result.id}')">
          <div class="search-result-icon ${result.iconClass}">
            <i class="${result.icon}"></i>
          </div>
          <div class="search-result-content">
            <h4>${highlightMatch(result.name, query)}</h4>
            <p>${highlightMatch(result.description, query)}</p>
          </div>
          <div class="search-result-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      `,
        )
        .join("")}
    `
  } else {
    searchResults.innerHTML = `
      <div class="search-no-results">
        <i class="fas fa-search"></i>
        <h4>No results found</h4>
        <p>Try searching for "Instagram", "YouTube", "Netflix", or "Office"</p>
      </div>
    `
  }
}

// Highlight matching text in search results
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

// Handle search result selection
function selectSearchResult(itemId) {
  const searchModal = document.getElementById("searchModal")
  const searchInput = document.getElementById("searchInput")
  const searchResults = document.getElementById("searchResults")

  // Close search modal
  searchModal.classList.remove("active")
  searchInput.value = ""
  searchResults.innerHTML = ""

  // Define actions for each item
  const actions = {
    "instagram-growth": () => showServiceDetails("instagram-growth"),
    "youtube-boost": () => showServiceDetails("youtube-boost"),
    "facebook-marketing": () => showServiceDetails("facebook-marketing"),
    "tiktok-viral": () => showServiceDetails("tiktok-viral"),
    "kick-growth": () => showServiceDetails("kick-growth"),
    "office-suite": () => showServiceDetails("office-suite"),
    "canva-pro": () => showServiceDetails("canva-pro"),
    "netflix-premium": () => showServiceDetails("netflix-premium"),
    "spotify-premium": () => showServiceDetails("spotify-premium"),
    services: () => showPage("services"),
    about: () => showPage("about"),
    contact: () => showPage("contact"),
  }

  // Execute the action
  if (actions[itemId]) {
    actions[itemId]()
  }
}

// Page Navigation
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })

  // Show target page
  const targetPage = document.getElementById(pageId)
  if (targetPage) {
    targetPage.classList.add("active")
    currentPage = pageId

    // Scroll to top
    window.scrollTo(0, 0)
  }
}

// Show specific service in services page
function showServiceInPage(serviceType) {
  showPage("services")

  // Scroll to the specific service card after a short delay to allow page transition
  setTimeout(() => {
    const serviceCard = document.querySelector(`.service-card-full[data-service="${serviceType}"]`)
    if (serviceCard) {
      serviceCard.scrollIntoView({ behavior: "smooth", block: "center" })
      // Add a highlight effect
      serviceCard.classList.add("highlight")
      setTimeout(() => {
        serviceCard.classList.remove("highlight")
      }, 2000)
    }
  }, 300)
}

// Counters Initialization
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number")
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target
        const target = Number.parseInt(counter.getAttribute("data-target"))
        animateCounter(counter, target)
        observer.unobserve(counter)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => observer.observe(counter))
}

function animateCounter(element, target) {
  let current = 0
  const increment = target / 100
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current).toLocaleString()
  }, 20)
}

// Service Filters Initialization
function initializeServiceFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn")
  const serviceCards = document.querySelectorAll(".service-card")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"))
      // Add active class to clicked button
      btn.classList.add("active")

      const filter = btn.getAttribute("data-filter")

      serviceCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "block"
          setTimeout(() => {
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
          }, 100)
        } else {
          card.style.opacity = "0"
          card.style.transform = "translateY(20px)"
          setTimeout(() => {
            card.style.display = "none"
          }, 300)
        }
      })
    })
  })
}

// Cart Initialization
function initializeCart() {
  const cartBtn = document.getElementById("cartBtn")
  const cartSidebar = document.getElementById("cartSidebar")
  const closeCart = document.getElementById("closeCart")
  const checkoutBtn = document.getElementById("checkoutBtn")

  // Cart button click
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      cartSidebar.classList.add("active")
      updateCartDisplay()
    })
  }

  // Close cart
  if (closeCart) {
    closeCart.addEventListener("click", () => {
      cartSidebar.classList.remove("active")
    })
  }

  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length > 0) {
        cartSidebar.classList.remove("active")
        openCheckoutModal()
      } else {
        showNotification("Your cart is empty!", "error")
      }
    })
  }

  // Add to cart buttons
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      const service = btn.getAttribute("data-service")
      const price = Number.parseInt(btn.getAttribute("data-price"))
      const name = btn.getAttribute("data-name")

      addToCart({ id: service, name: name, price: price })
    })
  })

  // Close cart when clicking outside
  cartSidebar.addEventListener("click", (e) => {
    if (e.target === cartSidebar) {
      cartSidebar.classList.remove("active")
    }
  })
}

function addToCart(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id)

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1
  } else {
    cart.push({ ...item, quantity: 1 })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartDisplay()
  showNotification("Item added to cart!", "success")
}

function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartDisplay()
}

function updateItemQuantity(itemId, change) {
  const item = cart.find((cartItem) => cartItem.id === itemId)
  if (item) {
    item.quantity = Math.max(1, (item.quantity || 1) + change)
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartDisplay()
  }
}

function updateCartDisplay() {
  const cartCount = document.getElementById("cartCount")
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")

  // Service icon mapping
  const serviceIcons = {
    "instagram-growth": { icon: "fab fa-instagram", class: "instagram" },
    "youtube-boost": { icon: "fab fa-youtube", class: "youtube" },
    "facebook-marketing": { icon: "fab fa-facebook", class: "facebook" },
    "tiktok-viral": { icon: "fas fa-users", class: "tiktok" },
    "kick-growth": { icon: "fas fa-bolt", class: "kick" },
    "office-suite": { icon: "fas fa-file-alt", class: "office" },
    "canva-pro": { icon: "fas fa-palette", class: "canva" },
    "netflix-premium": { icon: "fas fa-play", class: "netflix" },
    "spotify-premium": { icon: "fas fa-music", class: "spotify" },
  }

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  if (cartCount) {
    cartCount.textContent = totalItems
    cartCount.style.display = totalItems > 0 ? "flex" : "none"
  }

  // Update cart items
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML =
        '<p style="text-align: center; color: var(--text-gray); padding: 2rem;">Your cart is empty</p>'
    } else {
      cartItems.innerHTML = cart
        .map((item) => {
          const serviceIcon = serviceIcons[item.id] || { icon: "fas fa-star", class: "default" }
          return `
        <div class="cart-item">
          <div class="cart-item-image ${serviceIcon.class}">
            <i class="${serviceIcon.icon}"></i>
          </div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-price">${item.price} MAD</div>
            <div class="cart-item-controls">
              <div class="quantity-control">
                <button class="quantity-btn" onclick="updateItemQuantity('${item.id}', -1)">-</button>
                <span class="quantity-display">${item.quantity || 1}</span>
                <button class="quantity-btn" onclick="updateItemQuantity('${item.id}', 1)">+</button>
              </div>
            </div>
          </div>
          <button class="remove-item" onclick="removeFromCart('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `
        })
        .join("")
    }
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  if (cartTotal) {
    cartTotal.textContent = total
  }
}

// Service Details Modal
function showServiceDetails(serviceType) {
  const modal = document.getElementById("serviceModal")
  const modalTitle = document.getElementById("modalTitle")
  const serviceIconLarge = document.querySelector(".service-icon-large")
  const currentPrice = document.querySelector(".price-display .current-price")
  const originalPrice = document.querySelector(".price-display .original-price")
  const serviceDescription = document.querySelector(".service-info p")
  const includedFeatures = document.querySelector(".included-features")

  // Service data with enhanced information
  const services = {
    "instagram-growth": {
      title: "Instagram Growth Package",
      price: 299,
      originalPrice: 399,
      icon: "fab fa-instagram",
      iconClass: "instagram",
      description:
        "Complete Instagram growth solution with followers, likes, views, and engagement boost. Our premium package includes real, active followers and guaranteed engagement.",
      features: [
        "1000+ Real Followers",
        "500+ Post Likes",
        "Story Views",
        "24/7 Support",
        "Analytics Dashboard",
        "Growth Strategy Guide",
      ],
      packages: [
        { name: "Starter", price: 299, originalPrice: 399, followers: "1000+", likes: "500+" },
        { name: "Growth", price: 399, originalPrice: 499, followers: "2500+", likes: "1000+" },
        { name: "Pro", price: 499, originalPrice: 599, followers: "5000+", likes: "2000+" },
        { name: "Enterprise", price: 699, originalPrice: 899, followers: "10000+", likes: "5000+" },
      ],
    },
    "youtube-boost": {
      title: "YouTube Channel Boost",
      price: 399,
      originalPrice: 499,
      icon: "fab fa-youtube",
      iconClass: "youtube",
      description:
        "Grow your YouTube channel with subscribers, views, and watch time optimization. Perfect for content creators looking to monetize their channel.",
      features: [
        "500+ Subscribers",
        "10K+ Video Views",
        "Watch Time Boost",
        "SEO Optimization",
        "Thumbnail Design Tips",
        "Content Strategy",
      ],
      packages: [
        { name: "Starter", price: 399, originalPrice: 499, subscribers: "500+", views: "10K+" },
        { name: "Growth", price: 499, originalPrice: 599, subscribers: "1000+", views: "25K+" },
        { name: "Pro", price: 599, originalPrice: 699, subscribers: "2500+", views: "50K+" },
        { name: "Enterprise", price: 799, originalPrice: 999, subscribers: "5000+", views: "100K+" },
      ],
    },
    "facebook-marketing": {
      title: "Facebook Marketing Suite",
      price: 249,
      originalPrice: 349,
      icon: "fab fa-facebook",
      iconClass: "facebook",
      description:
        "Comprehensive Facebook marketing with page likes, post engagement, and reach. Ideal for businesses looking to expand their social presence.",
      features: [
        "1000+ Page Likes",
        "Post Engagement",
        "Reach Boost",
        "Analytics Report",
        "Ad Campaign Setup",
        "Content Calendar",
      ],
      packages: [
        { name: "Starter", price: 249, originalPrice: 349, likes: "1000+", engagement: "Basic" },
        { name: "Growth", price: 349, originalPrice: 449, likes: "2500+", engagement: "Standard" },
        { name: "Pro", price: 449, originalPrice: 549, likes: "5000+", engagement: "Advanced" },
        { name: "Enterprise", price: 649, originalPrice: 849, likes: "10000+", engagement: "Premium" },
      ],
    },
    "tiktok-viral": {
      title: "TikTok Viral Package",
      price: 199,
      originalPrice: 299,
      icon: "fas fa-users",
      iconClass: "tiktok",
      description:
        "Make your TikTok content go viral with followers, likes, and views. Our viral package is designed to boost your content's visibility.",
      features: [
        "2000+ Followers",
        "5K+ Video Likes",
        "50K+ Views",
        "Trending Support",
        "Hashtag Strategy",
        "Viral Content Tips",
      ],
      packages: [
        { name: "Starter", price: 199, originalPrice: 299, followers: "2000+", views: "50K+" },
        { name: "Growth", price: 299, originalPrice: 399, followers: "5000+", views: "100K+" },
        { name: "Pro", price: 399, originalPrice: 499, followers: "10000+", views: "250K+" },
        { name: "Enterprise", price: 599, originalPrice: 799, followers: "25000+", views: "500K+" },
      ],
    },
    "kick-growth": {
      title: "Kick Streamer Growth",
      price: 179,
      originalPrice: 249,
      icon: "fas fa-bolt",
      iconClass: "kick",
      description:
        "Boost your Kick streaming with followers, viewers, and engagement. Perfect for streamers looking to build their audience.",
      features: [
        "500+ Followers",
        "Live Viewers",
        "Chat Engagement",
        "Stream Promotion",
        "Streaming Setup Guide",
        "Community Building",
      ],
      packages: [
        { name: "Starter", price: 179, originalPrice: 249, followers: "500+", viewers: "Basic" },
        { name: "Growth", price: 279, originalPrice: 349, followers: "1000+", viewers: "Standard" },
        { name: "Pro", price: 379, originalPrice: 449, followers: "2500+", viewers: "Advanced" },
        { name: "Enterprise", price: 479, originalPrice: 599, followers: "5000+", viewers: "Premium" },
      ],
    },
    "office-suite": {
      title: "Microsoft Office Suite",
      price: 249,
      originalPrice: 349,
      icon: "fas fa-file-alt",
      iconClass: "office",
      description:
        "Get premium Microsoft Office subscriptions at discounted rates with full support. Includes all essential productivity tools.",
      features: [
        "Word, Excel, PowerPoint",
        "OneDrive Storage",
        "Microsoft Teams",
        "Technical Support",
        "Regular Updates",
        "Multi-Device Access",
      ],
      packages: [
        { name: "Personal", price: 249, originalPrice: 349, devices: "1 Device", storage: "5GB" },
        { name: "Family", price: 349, originalPrice: 449, devices: "3 Devices", storage: "15GB" },
        { name: "Business", price: 449, originalPrice: 549, devices: "5 Devices", storage: "50GB" },
        { name: "Enterprise", price: 549, originalPrice: 649, devices: "Unlimited", storage: "100GB" },
      ],
    },
    "canva-pro": {
      title: "Canva Pro Subscription",
      price: 149,
      originalPrice: 199,
      icon: "fas fa-palette",
      iconClass: "canva",
      description:
        "Unlock premium design tools with Canva Pro for stunning graphics and presentations. Perfect for content creators and businesses.",
      features: [
        "Premium Templates",
        "Brand Kit",
        "Background Remover",
        "100GB Storage",
        "Team Collaboration",
        "Advanced Export Options",
      ],
      packages: [
        { name: "Personal", price: 149, originalPrice: 199, users: "1 User", storage: "100GB" },
        { name: "Duo", price: 199, originalPrice: 249, users: "2 Users", storage: "200GB" },
        { name: "Team", price: 299, originalPrice: 349, users: "5 Users", storage: "500GB" },
        { name: "Business", price: 399, originalPrice: 499, users: "10 Users", storage: "1TB" },
      ],
    },
    "netflix-premium": {
      title: "Netflix Premium Subscription",
      price: 129,
      originalPrice: 179,
      icon: "fas fa-play",
      iconClass: "netflix",
      description:
        "Get premium Netflix subscriptions with 4K streaming and multiple device access. Enjoy unlimited entertainment.",
      features: [
        "4K Ultra HD",
        "Multiple Devices",
        "Ad-Free Experience",
        "Unlimited Movies & Shows",
        "Offline Downloads",
        "Family Profiles",
      ],
      packages: [
        { name: "Basic", price: 129, originalPrice: 179, quality: "HD", screens: "1 Screen" },
        { name: "Standard", price: 159, originalPrice: 209, quality: "Full HD", screens: "2 Screens" },
        { name: "Premium", price: 199, originalPrice: 249, quality: "4K Ultra HD", screens: "4 Screens" },
        { name: "Family", price: 249, originalPrice: 299, quality: "4K Ultra HD", screens: "6 Screens" },
      ],
    },
    "spotify-premium": {
      title: "Spotify Premium Subscription",
      price: 99,
      originalPrice: 149,
      icon: "fas fa-music",
      iconClass: "spotify",
      description:
        "Get premium Spotify subscriptions with ad-free music streaming and offline listening. Perfect for music lovers.",
      features: [
        "Ad-Free Listening",
        "Offline Downloads",
        "High Quality Audio",
        "Unlimited Skips",
        "Podcast Access",
        "Cross-Device Sync",
      ],
      packages: [
        { name: "Individual", price: 99, originalPrice: 149, quality: "Standard", devices: "1 Device" },
        { name: "Duo", price: 129, originalPrice: 179, quality: "High", devices: "2 Devices" },
        { name: "Family", price: 159, originalPrice: 209, quality: "Premium", devices: "6 Devices" },
        { name: "Student", price: 49, originalPrice: 99, quality: "Standard", devices: "1 Device" },
      ],
    },
  }

  const service = services[serviceType]
  if (service) {
    // Store current service type in the modal for reference
    modal.dataset.serviceType = serviceType

    modalTitle.textContent = service.title
    currentPrice.textContent = `${service.price} MAD`
    originalPrice.textContent = `${service.originalPrice} MAD`
    serviceDescription.textContent = service.description

    // Update icon
    serviceIconLarge.className = `service-icon-large ${service.iconClass}`
    serviceIconLarge.innerHTML = `<i class="${service.icon}"></i>`

    // Update features with enhanced styling
    includedFeatures.innerHTML = `
      <h4>What's Included:</h4>
      ${service.features.map((feature) => `<li><i class="fas fa-check"></i> ${feature}</li>`).join("")}
    `

    // Update package options
    const packageOptionsContainer = document.querySelector(".package-options")
    packageOptionsContainer.innerHTML = ""

    service.packages.forEach((pkg, index) => {
      const packageOption = document.createElement("div")
      packageOption.className = `package-option ${index === 0 ? "active" : ""}`
      packageOption.dataset.index = index
      packageOption.innerHTML = `
        <span class="package-name">${pkg.name}</span>
        <span class="package-price">${pkg.price} MAD</span>
      `
      packageOptionsContainer.appendChild(packageOption)
    })

    // Add event listeners to package options
    document.querySelectorAll(".package-option").forEach((option) => {
      option.addEventListener("click", () => {
        // Remove active class from all options
        document.querySelectorAll(".package-option").forEach((opt) => opt.classList.remove("active"))
        // Add active class to clicked option
        option.classList.add("active")

        // Update price based on selected package
        const packageIndex = Number.parseInt(option.dataset.index)
        const selectedPackage = service.packages[packageIndex]

        currentPrice.textContent = `${selectedPackage.price} MAD`
        originalPrice.textContent = `${selectedPackage.originalPrice} MAD`

        // Update features based on selected package
        const packageSpecificFeatures = [...service.features] // Clone the base features

        // Add package-specific details to the first two features
        if (selectedPackage.followers) {
          packageSpecificFeatures[0] = `${selectedPackage.followers} Followers`
        }
        if (selectedPackage.likes) {
          packageSpecificFeatures[1] = `${selectedPackage.likes} Likes`
        }
        if (selectedPackage.subscribers) {
          packageSpecificFeatures[0] = `${selectedPackage.subscribers} Subscribers`
        }
        if (selectedPackage.views) {
          packageSpecificFeatures[1] = `${selectedPackage.views} Video Views`
        }
        if (selectedPackage.devices) {
          packageSpecificFeatures[0] = `Support for ${selectedPackage.devices}`
        }
        if (selectedPackage.storage) {
          packageSpecificFeatures[1] = `${selectedPackage.storage} Cloud Storage`
        }
        if (selectedPackage.quality) {
          packageSpecificFeatures[0] = `${selectedPackage.quality} Quality`
        }
        if (selectedPackage.screens) {
          packageSpecificFeatures[1] = `${selectedPackage.screens}`
        }
        if (selectedPackage.users) {
          packageSpecificFeatures[0] = `${selectedPackage.users}`
        }
        if (selectedPackage.engagement) {
          packageSpecificFeatures[1] = `${selectedPackage.engagement}`
        }

        includedFeatures.innerHTML = `
          <h4>What's Included:</h4>
          ${packageSpecificFeatures.map((feature) => `<li><i class="fas fa-check"></i> ${feature}</li>`).join("")}
        `
      })
    })

    modal.classList.add("active")
  }
}

function sendToWhatsApp(event) {
  event.preventDefault()

  const form = event.target
  const name = form.querySelector('input[name="name"]').value
  const email = form.querySelector('input[name="email"]').value
  const phone = form.querySelector('input[name="phone"]').value
  const subject = form.querySelector('input[name="subject"]').value
  const message = form.querySelector('textarea[name="message"]').value

  // Create WhatsApp message with proper formatting
  const whatsappMessage = `*New Contact Form Submission*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Subject:* ${subject}%0A*Message:* ${message}`

  // WhatsApp number with international format
  const whatsappNumber = "+212770264606"

  // Create WhatsApp URL
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  // Open WhatsApp in a new tab
  window.open(whatsappURL, "_blank")

  // Show success message
  showNotification("Redirecting to WhatsApp...", "success")

  // Reset form
  form.reset()
}

// Modal Management
function initializeModals() {
  const serviceModal = document.getElementById("serviceModal")
  const checkoutModal = document.getElementById("checkoutModal")
  const thankYouModal = document.getElementById("thankYouModal")
  const closeModal = document.getElementById("closeModal")

  // Close service modal
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      serviceModal.classList.remove("active")
    })
  }
  // Close modals when clicking outside
  ;[serviceModal, checkoutModal, thankYouModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active")
        }
      })
    }
  })

  // Quantity selector
  const minusBtn = document.querySelector(".qty-btn.minus")
  const plusBtn = document.querySelector(".qty-btn.plus")
  const quantitySpan = document.querySelector(".quantity")

  if (minusBtn && plusBtn && quantitySpan) {
    minusBtn.addEventListener("click", () => {
      const qty = Number.parseInt(quantitySpan.textContent)
      if (qty > 1) {
        quantitySpan.textContent = qty - 1
      }
    })

    plusBtn.addEventListener("click", () => {
      const qty = Number.parseInt(quantitySpan.textContent)
      quantitySpan.textContent = qty + 1
    })
  }

  // Add to cart from modal
  const addToCartModal = document.querySelector(".add-to-cart-modal")
  if (addToCartModal) {
    addToCartModal.addEventListener("click", () => {
      const quantity = Number.parseInt(document.querySelector(".quantity").textContent)
      const activePackage = document.querySelector(".package-option.active")
      const packagePrice = Number.parseInt(
        activePackage.querySelector(".package-price").textContent.replace(" MAD", ""),
      )
      const packageName = activePackage.querySelector(".package-name").textContent
      const serviceType = serviceModal.dataset.serviceType
      const serviceTitle = document.getElementById("modalTitle").textContent

      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: serviceType,
          name: `${serviceTitle} - ${packageName}`,
          price: packagePrice,
        })
      }

      serviceModal.classList.remove("active")
    })
  }
}

// Checkout Process
function openCheckoutModal() {
  const checkoutModal = document.getElementById("checkoutModal")
  checkoutModal.classList.add("active")
  goToShipping()
}

function closeCheckout() {
  const checkoutModal = document.getElementById("checkoutModal")
  checkoutModal.classList.remove("active")
}

function goToShipping() {
  document.querySelectorAll(".checkout-step").forEach((step) => step.classList.remove("active"))
  document.getElementById("shippingStep").classList.add("active")
}

function goToPayment() {
  // Validate shipping form
  const form = document.querySelector(".shipping-form")
  const inputs = form.querySelectorAll("input[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "var(--red)"
      isValid = false
    } else {
      input.style.borderColor = ""
    }
  })

  if (!isValid) {
    showNotification("Please fill in all required fields", "error")
    return
  }

  // Update order summary
  updateOrderSummary()

  document.querySelectorAll(".checkout-step").forEach((step) => step.classList.remove("active"))
  document.getElementById("paymentStep").classList.add("active")
}

function updateOrderSummary() {
  const orderSummaryItems = document.getElementById("orderSummaryItems")
  const orderTotalPrice = document.getElementById("orderTotalPrice")

  if (orderSummaryItems) {
    orderSummaryItems.innerHTML = cart
      .map((item) => {
        return `
        <div class="order-item">
          <span>${item.name} x${item.quantity || 1}</span>
          <span>${item.price * (item.quantity || 1)} MAD</span>
        </div>
      `
      })
      .join("")
  }

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const usdTotal = Math.round(total * 0.1 * 100) / 100 // Convert MAD to USD (approximate rate)

  if (orderTotalPrice) {
    orderTotalPrice.innerHTML = `${total} MAD <br><small>(≈ $${usdTotal} USD)</small>`
  }
}

function processPayment() {
  const selectedPayment = document.querySelector('input[name="payment"]:checked')

  if (!selectedPayment) {
    showNotification("Please select a payment method", "error")
    return
  }

  const paymentMethod = selectedPayment.value
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)

  // Show processing notification
  showNotification("Processing payment...", "info")

  setTimeout(() => {
    if (paymentMethod === "paypal") {
      // Create PayPal payment form
      createPayPalPayment(total)

      // Close checkout modal after redirecting to PayPal
      setTimeout(() => {
        closeCheckout()
      }, 1000)
    }
  }, 1000)
}

// Add new function to create PayPal payment with proper return handling
function createPayPalPayment(amount) {
  // Convert MAD to USD (approximate rate)
  const usdAmount = Math.round(amount * 0.1 * 100) / 100

  // Create a form to submit to PayPal
  const form = document.createElement("form")
  form.method = "POST"
  form.action = "https://www.paypal.com/cgi-bin/webscr"
  form.target = "_blank"

  // Generate unique order ID
  const orderId = "order_" + Date.now()

  // PayPal form fields
  const fields = {
    cmd: "_xclick",
    business: "cnt.idrissi@gmail.com",
    item_name: "Idrissi Social Media Services",
    amount: usdAmount,
    currency_code: "USD",
    return: window.location.origin + window.location.pathname + "?payment=success&order=" + orderId,
    cancel_return: window.location.origin + window.location.pathname + "?payment=cancelled",
    notify_url: window.location.origin + "/paypal-ipn",
    custom: orderId,
    no_shipping: "1",
    no_note: "1",
    rm: "2", // Return method: POST with all payment variables
  }

  // Create hidden input fields
  Object.keys(fields).forEach((key) => {
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = key
    input.value = fields[key]
    form.appendChild(input)
  })

  // Store order details in localStorage for return handling
  localStorage.setItem(
    "pendingOrder",
    JSON.stringify({
      orderId: orderId,
      amount: amount,
      usdAmount: usdAmount,
      items: cart,
      timestamp: Date.now(),
    }),
  )

  // Add form to page and submit
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)

  showNotification("Redirecting to PayPal for secure payment...", "info")
}

// Add function to check for payment return
function checkPaymentReturn() {
  const urlParams = new URLSearchParams(window.location.search)
  const paymentStatus = urlParams.get("payment")
  const orderId = urlParams.get("order")

  if (paymentStatus === "success" && orderId) {
    // Payment successful
    const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder") || "{}")

    if (pendingOrder.orderId === orderId) {
      // Clear cart and pending order
      cart = []
      localStorage.setItem("cart", JSON.stringify(cart))
      localStorage.removeItem("pendingOrder")
      updateCartDisplay()

      // Close any open modals
      closeCheckout()

      // Show thank you modal
      setTimeout(() => {
        showThankYou()
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }, 500)
    }
  } else if (paymentStatus === "cancelled") {
    // Payment cancelled
    showNotification("Payment was cancelled. You can try again anytime.", "info")
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

function showThankYou() {
  const thankYouModal = document.getElementById("thankYouModal")
  thankYouModal.classList.add("active")
}

function closeThankYou() {
  const thankYouModal = document.getElementById("thankYouModal")
  thankYouModal.classList.remove("active")
  showPage("home")
}

function cancelPayment() {
  closeCheckout()
}

// Forms Initialization
function initializeForms() {
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    // Remove the old event listener and let the onsubmit handle it
    // The form now uses onsubmit="sendToWhatsApp(event)" in HTML
  }

  // Format card number input
  const cardNumberInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]')
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", (e) => {
      const value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
      const formattedValue = value.match(/.{1,4}/g)?.join(" ") || value
      e.target.value = formattedValue
    })
  }

  // Format expiry date input
  const expiryInput = document.querySelector('input[placeholder="MM/YY"]')
  if (expiryInput) {
    expiryInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4)
      }
      e.target.value = value
    })
  }
}

// Scroll Animations Initialization
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".glass-card, .step-item, .section-header").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// Utility Functions
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "var(--green)" : type === "error" ? "var(--red)" : "var(--primary-blue)"};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: var(--shadow-lg);
    z-index: 4000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
  `
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Add notification animations
const style = document.createElement("style")
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`
document.head.appendChild(style)

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Handle browser back/forward buttons
window.addEventListener("popstate", (e) => {
  const hash = window.location.hash.substring(1) || "home"
  showPage(hash)

  // Update active nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${hash}`) {
      link.classList.add("active")
    }
  })
})

// Add this function to improve mobile experience by closing modals on back button
window.addEventListener('popstate', function(event) {
  // Close any open modals when back button is pressed
  const modals = document.querySelectorAll('.modal.active');
  modals.forEach(modal => {
    modal.classList.remove('active');
  });
  
  // Close cart if open
  const cartSidebar = document.getElementById('cartSidebar');
  if (cartSidebar && cartSidebar.classList.contains('active')) {
    cartSidebar.classList.remove('active');
  }
  
  // Close mobile menu if open
  const navMenu = document.querySelector('.nav-menu');
  const hamburger = document.getElementById('hamburger');
  if (navMenu && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  }
});

// Add this to fix iOS 100vh issue
function setMobileHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Call the function on load and resize
window.addEventListener('resize', setMobileHeight);
window.addEventListener('orientationchange', setMobileHeight);
setMobileHeight();

// Initialize page based on URL hash and check for payment return
window.addEventListener("load", () => {
  // Check for payment return first
  checkPaymentReturn()

  const hash = window.location.hash.substring(1) || "home"
  showPage(hash)

  // Update active nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${hash}`) {
      link.classList.add("active")
    }
  })
})
