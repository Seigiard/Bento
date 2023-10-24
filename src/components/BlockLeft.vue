<template>
  <div class="linksBlockLeft">
    <div class="buttonsContainer">
      <a v-for="button in buttons"
        :href="button.link"
        :target="openInNewTab ? '_blank' : ''"
        :title="button.name"
        class="card button"
      >
        <Icon :name="button.icon" class="buttonIcon" :stroke-width="2" />
      </a>
    </div>
  </div>
</template>

<script>
  import CONFIG from '../export-config';

  export default {
    data() {
      return {
        buttons: CONFIG.firstButtonsContainer,
        openInNewTab: CONFIG.openInNewTab,
      };
    }
  }
</script>