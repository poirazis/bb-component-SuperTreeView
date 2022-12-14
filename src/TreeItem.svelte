<script>
    export let selectable
    export let selected = false
    export let open = false
    export let href = false
    export let onClick
    export let title
    export let icon 
    export let size
    export let id = ""

    let iconSize = "ri-sm"
    $: id = sanitize(id)

    // Clear the erroneous wrapping of id fields on relationships from DataProvider
    function sanitize (input)
    {
      if (String(input).startsWith("%5B")) {
        input = String(input).slice(3,-3);
      }
      return input
    }

    function handleClick (event) {
      if ($$slots.default)
        open = !open
      else 
        selected = selectable ? !selected : false; 

      if (onClick) onClick({ nodeType : " Items"});    
    }
  </script>
  
  <!-- svelte-ignore a11y-click-events-have-key-events -->

  <li  
    class:is-selected={selected}
    class:is-open={open}
    class="spectrum-TreeView-item"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span on:click={handleClick}  class="spectrum-TreeView-itemLink" {href}> 

      {#if $$slots.default}
        <svg
          class="spectrum-Icon spectrum-UIIcon-ChevronRight100 spectrum-TreeView-itemIndicator"
          focusable="false"
          aria-hidden="true"
        >
          <use xlink:href="#spectrum-css-icon-Chevron100" />
        </svg>
      {/if}
      
      <span class="spectrum-TreeView-itemLabel">       
        {#if icon}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
          <i class="{icon} {iconSize}" />
        {/if} 
       {title} 
      </span>
    </span>

    {#if $$slots.default}
      <ul class="spectrum-TreeView spectrum-Treeview--size{size}">
        <slot />
      </ul>
    {/if}

  </li>

  <style>
    i {
      margin-right: 0.25rem;
    }
    .spectrum-TreeView-itemLabel {
      display: flex;
      align-items: center;
    }
  </style>