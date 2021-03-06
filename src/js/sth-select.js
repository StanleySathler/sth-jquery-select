"use strict";

/*
 * Dependencies
 */
const $ = window.jQuery;

/*
 * Constructor
 */
(function(){

	$.fn.SthSelect = function SthSelect(properties){

		var _$originalSelect = null;
		var _$popup = null;
		var _$fakeSelect = null;
		var _properties = {};
		var _values = [];

		(function initialize($this){
			_$originalSelect = $this;
			_properties = buildDefault(properties);
			_values = extractValues($this);
			_$fakeSelect = fudgeSelect($this, properties);

			let popupProperties = {
				items: _values,
				title: _properties.title,
				hasFilter: _properties.filter,
				filterPlaceholder: _properties.filterPlaceholder,
				caseSensitive: _properties.caseSensitive,
				onOpen: _properties.onOpen,
				onSelect: _properties.onSelect,
				onHide: _properties.onHide
			};
			_$popup = (new window.SthSelect.SthSelectPopup(popupProperties));

			_$popup.onSelect(applySelectedValue);
			_$fakeSelect.click(openPopup);

		})( $(this) );

		function buildDefault(properties){
			return $.extend({
				title: "Select an option",
				placeholder: "Choose an option",
				autoSize: false,
				filter: false,
				filterPlaceholder: "Search",
				caseSensitive: false,
				onOpen: Function.prototype,
				onSelect: Function.prototype,
				onHide: Function.prototype
			}, properties);
		}

		function extractValues($this){
			let values = [];
			$this.find("option").each(function(){
				let $option = $(this);
				let content = { value: $option.val(), text: $option.text() };
				values.push( content );
			});

			return values;
		}

		function fudgeSelect($select, properties){
			$select.hide();

			let $fakeSelect = $('<div class="sth-select"></div>');
			let $fakeSelectText = $('<span class="sth-select-text"></span>');
			let $fakeSelectArrow = $('<span class="sth-select-arrow"></span>');

			$fakeSelectText.text(properties.placeholder);
			$fakeSelect.append( $fakeSelectText );
			$fakeSelect.append( $fakeSelectArrow );

			if( ! properties.autoSize )
				$fakeSelect.addClass("fixed-width");

			$select.after($fakeSelect);

			return $fakeSelect;
		}

		function openPopup(e){
			_$popup.show(e);
		}

		function applySelectedValue(selectedValue){
			let value = selectedValue.value;
			_$originalSelect.val(value);

			let text = selectedValue.text;
			_$fakeSelect.find(".sth-select-text").text(text);
		}
	};

	window.SthSelect = window.SthSelect || {};
	window.SthSelect.init = window.SthSelect.init || SthSelect;
})();

/*
 * Load all elements which use the component by HTML attributes API
 */
$(document).ready(function loadFromHtmlAPI(){

	let $elements = $("select[sth-select]");

	$elements.each(function(){
		let $element = $(this);
		let title = $element.attr("sth-select-title");
		let placeholder = $element.attr("sth-select-placeholder");
		let autoSize = $element.attr("sth-select-autosize");
		let filter = $element.attr("sth-select-filter");
		let filterPlaceholder = $element.attr("sth-select-filter-placeholder");
		const caseSensitive = $element.attr("sth-select-case-sensitive");

		$element.SthSelect({
			title: title,
			placeholder: placeholder,
			autoSize: boolFromString(autoSize),
			filter: boolFromString(filter),
			filterPlaceholder: filterPlaceholder,
			caseSensitive: boolFromString(caseSensitive),
			onOpen: (e) => console.log('onOpen', e),
			onSelect: (item, e) => console.log('onSelect', item, e),
			onHide: (e) => console.log('onHide', e)
		});
	});

	function boolFromString(string){
		return (string == "true");
	}

});
