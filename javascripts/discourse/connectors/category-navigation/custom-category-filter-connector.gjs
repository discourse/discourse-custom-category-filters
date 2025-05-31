import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import CustomCategoryFilters from "../../components/custom-category-filters";

@classNames("category-navigation-outlet", "custom-category-filter-connector")
export default class CustomCategoryFilterConnector extends Component {
  <template><CustomCategoryFilters @category={{this.category}} /></template>
}
