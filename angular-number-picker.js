/**
 *
 *  Defines `hNumberPicker` directive which can only be used as element.
 *
 *  It allows end-user to choose number, instead of typing
 *
 *  usage:
 *
 *       <h-number value="input.num" min="1" max="10" step="1" change="onChange()"></h-number>
 *
 *  @author  Howard.Zuo, Leon.Zhang
 *  @date    Sep 17th, 2015
 *
 */
(function(global) {
    'use strict';

    var definition = function(angular) {

        var defaults = {
            min: 0,
            max: 1000000,
            step: 1,
            timeout: 600
        };

        var assign = function(dest, src) {
            for (var key in src) {
                if (!dest[key]) {
                    dest[key] = src[key];
                }
            }
            return dest;
        };

        var isNumber = function(value) {
            var val = Number(value);
            return !isNaN(val) && val == value;
        };

        var toNumber = function(value) {
            return Number(value);
        };

        var checkNumber = function(value) {
            if (!isNumber(value)) {
                throw new Error('value [' + value + '] is not a valid number');
            }
        };

        var getTarget = function(e) {
            if (e.touches && e.touches.length > 0) {
                return angular.element(e.touches[0].target);
            }
            return angular.element(e.target);
        };

        var getType = function(e) {
            return getTarget(e).attr('type');
        };

        var transform = function(opts) {
            for (var key in opts) {
                var value = opts[key];
                opts[key] = toNumber(value);
            }
        };

        var directive = function($timeout, $interval) {

            return {
                restrict: 'E',
                scope: {
                    'value': '=',
                    'singular': '@',
                    'plural': '@',
                    'min': '=',
                    'max': '=',
                    'step': '@',
                    'change': '&'
                },
                link: function($scope, element) {

                    var opts = assign({
                        step: $scope.step
                    }, defaults);


                    if($scope.min == undefined){
                        $scope.min = defaults.min
                    }else{
                        checkNumber($scope.min);
                    }
                    if($scope.max == undefined){
                        $scope.max = defaults.max
                    }else{
                        console.log('max', $scope.max)
                        checkNumber($scope.max);
                    }

                    checkNumber(opts.step);

                    transform(opts);

                    if ($scope.min > $scope.value) {
                        $scope.value = $scope.min;
                    }

                    $scope.$watch('value', function(newValue) {
                        $scope.canDown = newValue > $scope.min;
                        $scope.canUp = newValue < $scope.max;
                        $scope.change();
                    });

                    var changeNumber = function($event) {
                        var type = getType($event);
                        if ('up' === type) {
                            if ($scope.value >= $scope.max) {
                                return;
                            }
                            $scope.value = parseInt($scope.value) + opts.step;
                        } else if ('down' === type) {
                            if ($scope.value <= $scope.min) {
                                return;
                            }
                            $scope.value = parseInt($scope.value) - opts.step;
                        }
                    };

                    var timeoutPro;
                    var intervalPro;
                    var start;
                    var end;
                    var addon = element.find('span');

                    addon.on('click', function(e) {
                        changeNumber(e);
                        $scope.$apply();
                        e.stopPropagation();
                    });

                    $scope.$on('$destroy', function() {
                        addon.off('touchstart touchend click');
                    });

                    $scope.inputLostFocus = function () {
                        if($scope.value < 1 || $scope.value === "" || $scope.value === undefined || !isNumber($scope.value)){
                            $scope.value = 1;
                        }else if(isNumber($scope.value) && $scope.value > $scope.max){
                            $scope.value = $scope.max;
                        }
                    }
                },
                    template: '<div class="row row-center rowThinPadding2 number-picker-style" style="border: #cccccc 1px solid; margin-top: 2px; margin-bottom: 2px; border-radius:4px">'+
                                '<span class="button button-small button-clear col col-30 col-center color-canDown-{{canDown}}" type="down" ng-disabled="!canDown" style="height: 34px; color:#555555; border-radius:0">-</span>' +
                                '<input type="text" class="col-40 col col-center text-center form-control" ng-model="value" ng-blur="inputLostFocus()" style="height:34px;border-radius:0;border-bottom:0; border-top:0; border-right: #cccccc 1px solid; border-left: #cccccc 1px solid; padding: 0">' +
                                '<span class="button button-small button-clear col col-30 col-center color-canUp-{{canUp}}" style="height: 34px; color:#555555; border-radius:0" type="up" ng-disabled="!canUp">+</span>' +
                                '</div>'
            };
        };

        var name = 'ionicNumberPicker';
        angular.module(name, [])
            .directive('hNumber', ['$timeout', '$interval', directive]);
        return name;
    };

    if (typeof exports === 'object') {
        module.exports = definition(require('angular'));
    } else if (typeof define === 'function' && define.amd) {
        define(['angular'], definition);
    } else {
        definition(global.angular);
    }

}(window));
