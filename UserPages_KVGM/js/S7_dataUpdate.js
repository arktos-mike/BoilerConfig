"use strict";
var plcType;
var writeData;
var data;
var data1, data2, data3, data4, data5, data6;
var jsonData;
var diChannel = { 0: "--", 1: "DIa.0", 2: "DIa.1", 3: "DIa.2", 4: "DIa.3", 5: "DIa.4", 6: "DIa.5", 7: "DIa.6", 8: "DIa.7", 9: "DIb.0", 10: "DIb.1", 11: "DIb.2", 12: "DIb.3", 13: "DIb.4", 14: "DIb.5", 15: "DIb.6", 16: "DIb.7" };
var doChannel = { 0: "--", 1: "DQa.0", 2: "DQa.1", 3: "DQa.2", 4: "DQa.3", 5: "DQa.4", 6: "DQa.5", 7: "DQa.6", 8: "DQa.7", 9: "DQb.0", 10: "DQb.1", 11: "DQb.2", 12: "DQb.3", 13: "DQb.4", 14: "DQb.5", 15: "DQb.6", 16: "DQb.7" };
var aiChannel = { 0: "--", 1: "I0", 2: "I1", 3: "I2", 4: "I3", 5: "I4", 6: "I5", 7: "I6", 8: "I7" };
var aoChannel = { 0: "--", 1: "Q0", 2: "Q1", 3: "Q2", 4: "Q3" };
var module = { 0: "--", 1: "A3", 2: "A4", 3: "A5", 4: "A6", 5: "A7", 6: "A8", 7: "A9", 8: "A10", 9: "A11", 10: "A12", 11: "A13", 12: "A14", 13: "A15" };
var en = { 0: "нет", 1: "да" };
var mode = { 0: "РУЧ", 1: "АВТО" };
var eng = { 0: "Па", 1: "кПа", 2: "МПа", 3: "кгс/см²", 4: "мм рт.ст.", 5: "бар" };
(function ($) {
	$.fn.inputFilter = function (inputFilter) {
		return this.off("input keydown keyup mousedown mouseup select contextmenu drop").on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			} else {
				this.value = "";
			}
		});
	};
}(jQuery));
$(window).off("load resize ").on("load resize ", function () {
	$('.tbl-content').css({ 'height': $(window).height() - 145 + 'px' });
	var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
	$('.tbl-header').css({ 'padding-right': scrollWidth });
}).resize();
$(document).ready(function () {
	plcType = "1500";
	$.ajaxSetup({
		cache: false
	});
	$("#second").hide();
	$('#confirm').hide();
	$('#loading').hide();
	$("#wrong").hide();
	$("#login").off("click").on("click", function () {
		if ($("#loginusername").val() == 'admin' && $("#loginpassword").val() == '29011985') {
			$("#wrong").hide();
			$("#first").hide();
			$("#second").show();
			$('#loading').show();
			$.init();
		}
		else {
			$("#wrong").show();
		}
		$("#logout").off("click").on("click", function () {
			$("form")[0].reset();
			$("#first").show();
			$("#second").hide();
			$("#wrong").hide();
		});
	});

})

$.init = function () {
	$('#loading').show();
	data = "";
	writeData = "";
	jsonData = "";
	document.getElementById("table_open").innerHTML = "";
	S7Framework.initialize(plcType, "");
	$("#load").off("change").on("change", function () {
		jsonData = "";
		var file = document.getElementById("load").files[0];
		var reader = new FileReader();
		reader.addEventListener("load", function () {
			jsonData = JSON.parse(this.result);
			$.each(jsonData, function (k, v) {
				$.each(v.tags, function (n, i) {
					document.getElementById("v" + i.tag.replace(/[\.\"]/g, '')).value = i.val;
					$("#v" + i.tag.replace(/[\.\"]/g, '')).trigger("change");
					if (i.val == "1") {
						$("#v" + i.tag.replace(/[\.\"]/g, '')).prop("checked", true)
					}
					else {
						$("#v" + i.tag.replace(/[\.\"]/g, '')).prop("checked", false)
					}
				});
			});
		});
		reader.readAsText(file);
	});
	$.when(
		$.getJSON("tags1.html", function (data) { data1 = data; }),
		$.getJSON("tags2.html", function (data) { data2 = data; }),
		$.getJSON("tags3.html", function (data) { data3 = data; }),
		$.getJSON("tags4.html", function (data) { data4 = data; }),
		$.getJSON("tags5.html", function (data) { data5 = data; }),
		$.getJSON("tags6.html", function (data) { data6 = data; })
	).then(function () {
		data = $.extend(data1, data2, data3, data4, data5, data6);
		data1, data2, data3, data4, data5, data6 = '';
		$.each(data, function (k, v) {
			$("#table_open").append(
				'<tr><td colspan="4" class="grouptd">' + v.title + '</td></tr>'
			);
			$.each(v.tags, function (n, i) {
				var val;
				var control;
				var selected;
				if (i.eng == "0" | i.eng == "1" | i.eng == "2" | i.eng == "3" | i.eng == "4" | i.eng == "5") {
					i.eng = eng[i.eng];
				}
				switch (i.type) {
					case "":
						val = i.val;
						control = '<input type="text" id="v' + i.tag.replace(/[\.\"]/g, '') + '"value="' + i.val + '" maxlength="8" />';
						break;
					case "module":
						val = module[i.val];
						control = '<select id ="v' + i.tag.replace(/[\.\"]/g, '') + '"value="' + i.val + '">'
						selected = i.val;
						$.each(module, function (n, i) {
							if (n == selected) {
								control += '<option selected value="' + n + '">' + i + '</option>';
							}
							else {
								control += '<option value="' + n + '">' + i + '</option>';
							}
						});
						control += '</select>';
						break;
					case "en":
						val = en[i.val];
						if (i.val == "1") {
							control = '<span class="slidertext left" id="v' + i.tag.replace(/[\.\"]/g, '') + '_left">' + en[0] + '</span><label class="switch"><input checked type="checkbox" value="1" onchange="$(this).val(this.checked ? 1 : 0)" id="v' + i.tag.replace(/[\.\"]/g, '') + '" /><span class="slider round" id="v' + i.tag.replace(/[\.\"]/g, '') + '_center"></span></label><span class="slidertext right" id="v' + i.tag.replace(/[\.\"]/g, '') + '_right">' + en[1] + '</span>'
						}
						else {
							control = '<span class="slidertext left" id="v' + i.tag.replace(/[\.\"]/g, '') + '_left">' + en[0] + '</span><label class="switch"><input type="checkbox" value="0" onchange="$(this).val(this.checked ? 1 : 0)" id="v' + i.tag.replace(/[\.\"]/g, '') + '" /><span class="slider round" id="v' + i.tag.replace(/[\.\"]/g, '') + '_center"></span></label><span class="slidertext right" id="v' + i.tag.replace(/[\.\"]/g, '') + '_right">' + en[1] + '</span>'
						}
						break;
					case "mode":
						val = mode[i.val];
						if (i.val == "1") {
							control = '<span class="slidertext left" id="v' + i.tag.replace(/[\.\"]/g, '') + '_left">' + mode[0] + '</span><label class="switch"><input checked type="checkbox" value="1" onchange="$(this).val(this.checked ? 1 : 0)" id="v' + i.tag.replace(/[\.\"]/g, '') + '" /><span class="slider round" id="v' + i.tag.replace(/[\.\"]/g, '') + '_center"></span></label><span class="slidertext right" id="v' + i.tag.replace(/[\.\"]/g, '') + '_right">' + mode[1] + '</span>'
						}
						else {
							control = '<span class="slidertext left" id="v' + i.tag.replace(/[\.\"]/g, '') + '_left">' + mode[0] + '</span><label class="switch"><input type="checkbox" value="0" onchange="$(this).val(this.checked ? 1 : 0)" id="v' + i.tag.replace(/[\.\"]/g, '') + '" /><span class="slider round" id="v' + i.tag.replace(/[\.\"]/g, '') + '_center"></span></label><span class="slidertext right" id="v' + i.tag.replace(/[\.\"]/g, '') + '_right">' + mode[1] + '</span>'
						}
						break;
					case "aiChannel":
						val = aiChannel[i.val];
						control = '<select id ="v' + i.tag.replace(/[\.\"]/g, '') + '">'
						selected = i.val;
						$.each(aiChannel, function (n, i) {
							if (n == selected) {
								control += '<option selected value="' + n + '">' + i + '</option>';
							}
							else {
								control += '<option value="' + n + '">' + i + '</option>';
							}
						});
						control += '</select>';
						break;
					case "aoChannel":
						val = aoChannel[i.val];
						control = '<select id ="v' + i.tag.replace(/[\.\"]/g, '') + '">'
						selected = i.val;
						$.each(aoChannel, function (n, i) {
							if (n == selected) {
								control += '<option selected value="' + n + '">' + i + '</option>';
							}
							else {
								control += '<option value="' + n + '">' + i + '</option>';
							}
						});
						control += '</select>';
						break;
					case "diChannel":
						val = diChannel[i.val];
						control = '<select id ="v' + i.tag.replace(/[\.\"]/g, '') + '">'
						selected = i.val;
						$.each(diChannel, function (n, i) {
							if (n == selected) {
								control += '<option selected value="' + n + '">' + i + '</option>';
							}
							else {
								control += '<option value="' + n + '">' + i + '</option>';
							}
						});
						control += '</select>';
						break;
					case "doChannel":
						val = doChannel[i.val];
						control = '<select id ="v' + i.tag.replace(/[\.\"]/g, '') + '">'
						selected = i.val;
						$.each(doChannel, function (n, i) {
							if (n == selected) {
								control += '<option selected value="' + n + '">' + i + '</option>';
							}
							else {
								control += '<option value="' + n + '">' + i + '</option>';
							}
						});
						control += '</select>';
						break;
				}
				$("#table_open").append(
					'<tr>' +
					'<td>' + i.title + '</td>' +
					'<td>' + val + '</td>' +
					'<td>' + control + '</td>' +
					'<td>' + i.eng + '</td></form></tr>'
				);
				$("#v" + i.tag.replace(/[\.\"]/g, '')).off("change").on("change", function () {
					if ($("#v" + i.tag.replace(/[\.\"]/g, '')).val() != i.val.replace("&#x2d;", "-")) {
						$("#v" + i.tag.replace(/[\.\"]/g, '')).css("color", "orange");
						$("#v" + i.tag.replace(/[\.\"]/g, '') + "_left").css("color", "orange");
						$("#v" + i.tag.replace(/[\.\"]/g, '') + "_right").css("color", "orange");
						$("#v" + i.tag.replace(/[\.\"]/g, '') + "_center").css("background-color", "orange");
					}
					else {
						$("#v" + i.tag.replace(/[\.\"]/g, '')).css("color", "#e7e7e7");
						$("#v" + i.tag.replace(/[\.\"]/g, '') + "_left").css("color", "#e7e7e7");
						$("#v" + i.tag.replace(/[\.\"]/g, '') + "_right").css("color", "#e7e7e7");
						$("#v" + i.tag.replace(/[\.\"]/g, '') + "_center").css("background-color", "#ccc");
					}
				}).trigger("change");
				$("#v" + i.tag.replace(/[\.\"]/g, '')).inputFilter(function (value) {
					return /^-?\d*[.]?\d*$/.test(value);
				});
			});
		});
		$('#loading').hide();
	});
	$("#save").off("click").on("click", function () {
		if (navigator.msSaveOrOpenBlob) {
			navigator.msSaveOrOpenBlob(new Blob([JSON.stringify(data, null, 2).replace(/&#x2d;/g, "-")], {
				type: "text/plain"
			}), "KVGM1-boilerConfig" + new Date().toLocaleDateString() + new Date().toLocaleTimeString() + ".tconf");
		} else {
			const a = document.createElement("a");
			a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2).replace(/&#x2d;/g, "-")], {
				type: "text/plain"
			}));
			a.setAttribute("download", "KVGM1-boilerConfig_" + new Date().toLocaleDateString() + "_" + new Date().toLocaleTimeString() + ".tconf");
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	});
	$("#write").off("click").on("click", function () {
		$('#confirm').show();
	});
	$("#confirmNo").off("click").on("click", function () {
		$('#confirm').hide();
	});
	$("#confirmYes").off("click").on("click", function () {
		writeData = "";
		$('#confirm').hide();
		$.each(data, function (k, v) {
			$.each(v.tags, function (n, i) {
				if ($("#v" + i.tag.replace(/[\.\"]/g, '')).val() != i.val.replace("&#x2d;", "-")) {
					writeData += i.tag + "=" + $("#v" + i.tag.replace(/[\.\"]/g, '')).val() + '&';
				}
			});
		});
		whenDone();
	});
}
function whenDone() {
	writeData += '"RegMap".Apply=1&';
	writeData += '"Q_gas".apply_correct_consumption=1';
	S7Framework.writeData("js/S7_dataToPLC.json", writeData, "", function () {
		$.init();
	});
}