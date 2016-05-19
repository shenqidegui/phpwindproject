/*
 * PHPWind WindEditor Plugin
 * @Copyright 	: Copyright 2011, phpwind.com
 * @Descript	: ����Ӧ�ò��
 * @Author		: wengqianshan@me.com
 * @Depend		: jquery.js(1.7 or later)
 * $Id: windeditor.js  $			:
 */
;(function ( $, window, undefined ) {

	var WindEditor = window.WindEditor;
	var pluginName = 'openApp';
	//Ӧ�ò������,д�����ñ༭����ҳ����
	/*var editorApp = {
		root: 'http://localhost/openApp/',
		items:[
			{
				name: 'demo',
				params: {len: 8, age: 2}
			},
			{
				name: 'map',
				params: {from: 'google'}
			},
			{
				name: 'xiuxiu',
				params: {type: 2}
			}
		]
	};*/

	WindEditor.plugin(pluginName,function() {
		if(typeof editorApp == 'undefined' || editorApp.items == undefined){
			return false;
		}
		var _self = this;
		//��������
		// var appWrap = $('<li id="J_app_icon_wrap" class="open_app_icons"></li>');
		// if($(".open_app_icons").length < 1){
		// 	appWrap.appendTo('.wind_editor_icons');
		// }
		_self.appsContainer = _self.toolbar.find('.plugin_icons');

		//���巽����ȷ��app�ܶ���windeditor
		WindEditor.initOpenApp = {};
		//������,����app����js�ļ�
		$.each(editorApp.items, function(key, item) {
			var name = item.name;
			//��ʼ��Ӧ�ò��
			WindEditor.initOpenApp[name] = function(callback){
				callback.call(_self, item, editorApp.root);
			}
			Wind.js(editorApp.root + name+'/editorApp.js?v=' + GV.JS_VERSION, function(){});
		});

	});
})( jQuery, window);