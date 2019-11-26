import { debounce } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { computed, observer } from "@ember/object";
import Controller from "@ember/controller";
import InfinityRoute from "ember-infinity/mixins/route";

export default Controller.extend(InfinityRoute, {
  queryParams: ["showQuantityItems"],
  showQuantityItems: false,

  getCurrentUser: computed(function() {
    var store = this.get("store");
    var currentUser = store.peekAll("user_profile").get("firstObject") || null;
    return currentUser;
  }).volatile(),

  sanitizeString(str) {
    // these are the special characters '.,)(@_-' that are allowed for search
    // '\.' => will allow '.'
    // '\(' => will allow '('
    // '\@' => will allow '@'
    // '\)' => will allow ')'
    str = str.replace(/[^a-z0-9áéíóúñü \.,\)\(@_-]/gim, "");
    return str.trim();
  },

  searchText: computed("searchInput", {
    get() {
      return this.get("searchInput") || "";
    },

    set(key, value) {
      return this.sanitizeString(value);
    }
  }),

  i18n: service(),
  store: service(),
  isLoading: false,
  hasNoResults: false,
  itemSetId: null,
  unloadAll: false,
  minSearchTextLength: 0,
  searchInput: null,
  toDesignateItem: null,

  hasSearchText: computed("searchText", function() {
    return !!this.get("searchText");
  }),

  onSearchTextChange: observer("searchText", function() {
    // wait before applying the filter
    if (this.get("searchText").length > this.get("minSearchTextLength")) {
      this.set("itemSetId", null);
      debounce(this, this.applyFilter, 500);
    } else {
      this.set("filteredResults", []);
    }
  }),

  applyFilter() {
    var searchText = this.get("searchText");
    if (searchText.length > 0) {
      this.set("isLoading", true);
      this.set("hasNoResults", false);
      if (this.get("unloadAll")) {
        this.get("store").unloadAll();
      }

      this.infinityModel(
        this.get("searchModelName"),
        {
          perPage: 25,
          startingPage: 1,
          modelPath: "filteredResults",
          stockRequest: true
        },
        {
          searchText: "searchText",
          itemId: "itemSetId",
          toDesignateItem: "toDesignateItem",
          showQuantityItems: "showQuantityItems"
        }
      )
        .then(data => {
          data.forEach(record => {
            if (record.constructor.toString() === "stock@model:designation:") {
              this.store.query("orders_package", {
                search_by_order_id: record.get("id")
              });
            }
          });
          if (this.get("searchText") === data.meta.search) {
            this.set("filteredResults", data);
            this.set("hasNoResults", data.get("length") === 0);
          }
        })
        .finally(() => this.set("isLoading", false));
    }
    this.set("filteredResults", []);
  },

  afterInfinityModel(records) {
    var searchText = this.get("searchText");
    if (searchText.length === 0 || searchText !== records.meta.search) {
      records.replaceContent(0, 25, []);
    }
  },

  actions: {
    clearSearch() {
      this.set("searchText", "");
    }
  }
});
