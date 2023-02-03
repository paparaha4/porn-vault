import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: colors.blue.base,
        error: colors.red.accent3,
        info: colors.blue.darken2,
        success: colors.green.base,
        warning: colors.orange.darken2
      },
      dark: {
        primary: colors.blue.lighten3,
        error: colors.red.accent2,
        info: colors.blue.darken2,
        success: colors.green.base,
        warning: colors.orange.lighten2
      }
    }
  }
});
