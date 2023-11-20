<template>
  <div class="linksBlockRight">
    <div class="listsContainer">
      <div class="card list" v-for="list in lists">
        <Icon :name="list.icon" class="listIcon" :stroke-width="2" />

        <a
          v-for="link in list.links"
          :target="openInNewTab ? '_blank' : ''"
          :href="link.link"
          class="listItem"
        >
          {{ link.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import CONFIG from '../config';

export default {
  data() {
    return {
      lists: CONFIG.firstListsContainer,
      openInNewTab: CONFIG.openInNewTab,
    };
  },
};
</script>
