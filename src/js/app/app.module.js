
angular.module("app", ["templates"])
.factory('mainData', function () {
        let data = makeDefaulData();
        let selectedData = null;
        function getData() {
          return data;
        }
        function filtredData (filterString, sortBy) {
          return data
                .filter (e => filterString ? e.title.indexOf(filterString) > -1: e)
                .sort ((a, b) => {
                  if (sortBy === 'date') {
                    let aDate = Date.parse(a.date);
                    let bDate = Date.parse(b.date)
                    if (aDate > bDate) {
                      return 1;
                    }
                    if (aDate < bDate) {
                      return -1;
                    }
                    return 0;
                  } else {
                    if (a.title > b.title) {
                      return 1;
                    }
                    if (a.title < b.title) {
                      return -1;
                    }
                    return 0;
                  }
                });
        }
        function addTagToSelected (tag) {
          if (selectedData) {
            selectedData.tags.push(tag)
          }
        }
        function deleteTagFromSelected (tag) {
          selectedData.tags = selectedData.tags.filter (t => t !== tag)
        }

        function setSelectedItem (item) {
          selectedData = item
        }

        function getSelectedItem () {
          
          return selectedData;
        }
        function getUniqTags () {
          let tags = data.map (t => t.tags).flat();
          return Array.from(new Set (tags)).join(', ');
        }
        function  getLatestItem () {
          return filtredData('', 'date').pop();
        }

        return {
          getData: getData,
          filtredData: filtredData,
          setSelectedItem: setSelectedItem,
          getSelectedItem: getSelectedItem,
          addTagToSelected: addTagToSelected,
          deleteTagFromSelected: deleteTagFromSelected,
          getUniqTags: getUniqTags,
          getLatestItem: getLatestItem
        };
  })
  .directive("app", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/app.tpl.html",
    };
  })
  .directive("contentView", () => {
    function contentViewController ($scope, $element, mainData) {
      $scope.filtredData = mainData.filtredData('');
      $scope.withDate = true;
      $scope.sortBy = 'title';
      $scope.localFiltreSearch = function () {
        $scope.filtredData =  mainData.filtredData($scope.search, $scope.sortBy);
      };
      $scope.localSetSelectedItem = function (item) {
        mainData.setSelectedItem(item);
      }
    }
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/content-view.tpl.html",
      controller: ["$scope", "$element",'mainData', contentViewController],
    };
  })
  .directive("sidebarView", () => {
    function sidebarViewController ($scope, $element, mainData, ) {
      $scope.selectedItem = mainData.getSelectedItem();
      $scope.addTag = function () {
        mainData.addTagToSelected($scope.newTag)
        $scope.newTag = '';
      }
      $scope.deleteTag = function (tag) {
        mainData.deleteTagFromSelected(tag)
      }
      $scope.$watch(function () { return mainData.getSelectedItem() }, function (newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.selectedItem = newVal
        }
      });
    }
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/sidebar-view.tpl.html",
      controller: ["$scope", "$element",'mainData', sidebarViewController],
    };
  })
  .directive("elementsView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/elements-view.tpl.html",
      controller: ["$scope", "$element", elementsViewCtrl],
    };
    function elementsViewCtrl($scope, $element) {
      $scope.model = {
        width: 300,
        widthButton: 300
      };
      $scope.setWidth = () => {
        let width = $scope.model.width;
        if (!width) {
          width = 1;
          $scope.model.width = width;
        }
        $scope.model.widthButton = width;
        $element.css("width", `${width}px`);
      };
      $scope.setWidth();
    }
  })
  .directive("some1", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<some-2></some-2>",
    };
  })
  .directive("some2", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<some-3></some-3>",
    };
  })
  .directive("some3", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<summary-view></summary-view>",
    };
  })
  .directive("summaryView", () => {
    function summaryViewController ($scope, $element, mainData) {
      $scope.latestItem = mainData.getLatestItem();
      $scope.uniqTags = mainData.getUniqTags();
      $scope.$watch(function () { return mainData.getUniqTags() }, function (newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.uniqTags = newVal
        }
      });
    }
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/summary-view.tpl.html",
      controller: ["$scope", "$element", 'mainData', summaryViewController],
    };
  });

  function makeDataId() {
    return `${Date.now()}:${Math.random().toString().substr(2)}`;
  }
  function makeDefaulData() {
    return [
      {
        id: makeDataId(),
        title: "Item 1",
        tags: ["tag 1", "tag 2"],
        date: "2020-03-02T17:32:00.000Z",
      },
      {
        id: makeDataId(),
        title: "Item 2",
        tags: [],
        date: "2020-01-20T13:12:00.000Z",
      },
      {
        id: makeDataId(),
        title: "Item 3",
        tags: ["tag tag tag", "tag 1"],
        date: "2020-02-11T08:42:00.000Z",
      },
      {
        id: makeDataId(),
        title: "Item 4 and text",
        tags: [],
        date: "2020-01-01T00:00:00.000Z",
      },
      {
        id: makeDataId(),
        title: "Item 5",
        tags: ["tag 3", "tag 4", "tag 1", "tag 10", "tag 50", "tag tag 22"],
        date: "2020-04-21T09:11:00.000Z",
      }
    ];
  }