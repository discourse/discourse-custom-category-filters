import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class CategoryFeaturedImages extends Component {
  @service router;

  get filteredSetting() {
    let parsedSetting = JSON.parse(settings.category_filters);
    let filteredSetting = [];

    parsedSetting.forEach((filter) => {
      // don't return empty settings
      if (Object.keys(filter).length) {
        filteredSetting.push(filter);
      }
    });

    let currentCategoryID = this?.args?.category?.id;
    let subcategoryParentID = this?.args?.category?.parentCategory?.id;

    filteredSetting.forEach((list) => {
      list.filters.forEach((filter) => {
        if (this.router.currentURL.includes(filter.link)) {
          // set active if the filter URL matches the current URL
          filter.active = true;

          if (filter.link_type === "subcategory") {
            // if subcategory is active, set the link to toggle back to the parent category
            let subcategoryParentSlug =
              this?.args?.category?.parentCategory?.slug;
            if (subcategoryParentSlug && subcategoryParentID) {
              filter.link = `/c/${subcategoryParentSlug}/${subcategoryParentID}`;
            }
          } else if (filter.link_type === "filter") {
            // if query param is active, set the link to remove the param
            filter.link = this?.router?.currentURL?.split("?")[0];
          }
        }
      });
    });

    return filteredSetting.filter(function (object) {
      return parseInt(object.category_id, 10) === currentCategoryID;
      // can optionally show filters on subcategories of relevant parent by adding `|| parseInt(object.category_id, 10) === subcategoryParentID`
    });
  }

  @action
  toggleClass(filter, event) {
    if (filter.link_type === "onPage") {
      // onPage is a special case where we can toggle multiple custom elements on the current page
      let currentButton = event.target.closest(".custom-category-filter");
      let customFilters = document.querySelectorAll(`[class*="custom-filter"]`);
      let buttons = document.querySelectorAll(
        `[class*="custom-category-filter"]`
      );
      let filterLink = filter.link.toLowerCase().replace(/\s/g, "");

      if (currentButton.classList.contains("active")) {
        // if active, we just want to toggle and show everything
        currentButton.classList.remove("active");
        customFilters.forEach((customFilter) => {
          customFilter.classList.remove("hidden");
        });
        document
          .querySelector(".custom-category-filter-show-all")
          .classList.add("hidden");
      } else {
        // if not active, we want to hide other filters except the one with the corresponding filter.link
        buttons.forEach((button) => {
          button.classList.remove("active");
        });

        // add active class to the button that was clicked
        currentButton.classList.add("active");

        // remove hidden class from everything
        customFilters.forEach((el) => {
          el.classList.remove("hidden");
        });

        // show "show all" button
        document
          .querySelector(".custom-category-filter-show-all")
          .classList.remove("hidden");

        // toggle hidden class for all others
        document
          .querySelectorAll(
            `[class*="custom-filter"]:not(.custom-filter_${filterLink})`
          )
          .forEach((el) => {
            el.classList.toggle("hidden");
          });
      }
    } else {
      return;
    }
  }

  @action
  showAll() {
    let customFilters = document.querySelectorAll(`[class*="custom-filter"]`);
    let buttons = document.querySelectorAll(
      `[class*="custom-category-filter"]`
    );

    // remove all hidden classes
    customFilters.forEach((el) => {
      el.classList.remove("hidden");
    });

    // remove all active classes
    buttons.forEach((button) => {
      button.classList.remove("active");
    });

    // hide show all button
    document
      .querySelector(".custom-category-filter-show-all")
      .classList.add("hidden");
  }
}
