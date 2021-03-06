// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  userServiceEndpoints: {
    API_ENDPOINT: 'http://localhost:8080/api',
    API_V1_ENDPOINT: 'http://localhost:8080/api/v1/users/',
    SIGN_UP_ENDPOINT: 'http://localhost:8080/api/v1/users/',
    ACTIVATION_ACCOUNT_ENDPOINT:
      'http://localhost:8080/api/v1/users/activation',
    PASSWORD_RESET_ENDPOINT: 'http://localhost:8080/api/v1/users/passwordreset',
    UPDATE_EMAIL_ENDPOINT: 'http://localhost:8080/api/v1/users/email',
    UPDATE_IMAGE_ENDPOINT: 'http://localhost:8080/api/v1/users/image',
    TOKEN_ENDPOINT: 'http://localhost:8080/api/v1/users/tokens',
    AUTHENTICATED_USER_ORDERS_HISTORY:
      'http://localhost:8080/api/v1/orders/authuser',
    USERS_PREFERRED_MEALS: 'http://localhost:8080/api/v1/users/preferences',
    USER_ORDERS_API_ENDPOINT:
      'http://localhost:8080/api/orders/search/findByUserEmail',
    USER_DETAILS_API_ENDPOINT: 'http://localhost:8080/api/v1/users/current',
    FILES_ENDOINT: 'http://localhost:8080/api/v1/restaurantfiles/file',
  },
  reviewServiceEndpoints: {
    API_V1_REVIEWS: 'http://localhost:8080/api/v1/reviews',
    FILES_ENDOINT: 'http://localhost:8080/api/v1/restaurantfiles/file',
  },
  paymentServiceEndpoints: {
    PAYMENT_ENDPOINT: 'http://localhost:8080/api/v1/payments',
  },
  mealServiceEndpoints: {
    API_V1: 'http://localhost:8080/api/v1/meals',
    FILES_ENDOINT: 'http://localhost:8080/api/v1/restaurantfiles/file',
  },
  mealOrderServiceEndpoints: {
    API: 'http://localhost:8080/api',
    API_V1: 'http://localhost:8080/api/v1/mealorders',
  },
  countriesServiceEndpoints: {
    API: 'https://restcountries.eu/rest/v2/all',
  },
  contactServiceEndpoint: {
    API: 'http://localhost:8080/api',
  },
  cartServiceEndpoint: {
    API: 'http://localhost:8080/api',
    API_V1: 'http://localhost:8080/api/v1',
    USER_CART: 'http://localhost:8080/api/v1/usercart',
  },
  authServiceEndpoints: {
    AUTH_ENDPOINT: 'http://localhost:8080/auth/',
    EMAIL_CHECK_ENDPINT: 'http://localhost:8080/api/users/search/existsByEmail',
  },
  chatSupportURL: 'http://localhost:3000/chat-support'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
