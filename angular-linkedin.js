(function(window, angular, undefined) {
  'use strict';

  // settings object available for module settings/services definition.
  var settings = {};

  /**
   * twttr module
   */
  angular.module('Linkedin', []).

    /**
     * linkedin provider
     */
    provider('Linkedin', [function() {

      /**
       * Facebook appId
       * @type {Number}
       */
      settings.api_key = null;
      this.setApiKey = function(apiKey) {
        settings.api_key = apiKey;
      };
      this.getApiKey = function() {
        return settings.api_key;
      };

      /**
       * This defines the linkedin service on run.
       */
      this.$get = ['$rootScope', '$q', '$window', function($rootScope, $q, $window) {
        /**
         * Create a new scope for listening to broadcasted events,
         * this is for better approach of asynchronous Linkdein API usage.
         * @type {Object}
         */
        var linkedinScope = $rootScope.$new(),
            deferred  = $q.defer(),
            ready = angular.isDefined($window.IN);

        if (ready) {
          deferred.resolve();
        }

        /**
         * Linkdein API is ready to use
         * @param  {Object} event
         * @param  {Object} linkedin
         */
        linkedinScope.$on('linkedin:ready', function(event) {
          ready = true;
          $rootScope.$apply(function() {
            deferred.resolve();
          });
        });

        return deferred.promise.then(function() { return $window.IN; });
      }];
  }]).

  // Initialization of module
  run(['$rootScope', '$q','$window', function($rootScope, $q, $window) {
    var js, html,
        script = $window.document.getElementsByTagName('script')[0];
    js = $window.document.createElement('script');
    js.src = 'https://platform.linkedin.com/in.js';
    settings['onLoad'] = 'onLinkedInLoad';
    html = '';
    for(var key in settings) {
      html += "\n\t" + key + ': ' + settings[key];
    }
    html += "\n";
    js.innerHTML = html;
    script.parentNode.insertBefore(js, script);

    $window.onLinkedInLoad = function() {
      $rootScope.$broadcast('linkedin:ready');
    };
  }]);

})(window, angular);
