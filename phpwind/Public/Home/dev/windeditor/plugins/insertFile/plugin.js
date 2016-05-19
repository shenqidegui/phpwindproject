/*
 * PHPWind WindEditor Plugin
 * @Copyright 	: Copyright 2011, phpwind.com
 * @Descript	: �ϴ��������
 * @Author		: chaoren1641@gmail.com
 * $Id: windeditor.js 4472 2012-02-19 10:41:01Z chris.chencq $			:
 */
;(function ( $, window, undefined ) {
	if(!window.ATTACH_CONFIG) {
		$.error('ATTACH_CONFIGû�ж��壬�����ϴ���Ҫ�ṩ���ö���');
		return;
	}
	if(!window.EDIT_CONFIG) {
		$.error('EDIT_CONFIGû�ж��壬�����ϴ���Ҫ�ṩ���ö���');
		return;
	}
	var WindEditor = window.WindEditor,
		browser = $.browser,
		ie = browser.msie,
		ie6 = ie && browser.version < 7,
		mozilla = browser.mozilla,
		webkit = browser.webkit,
		opera = browser.opera;

	var pluginName = 'insertFile',img_max_width = 500;
	var is_sell = EDIT_CONFIG.sell.ifopen == '1' ? true : false;//�Ƿ��и�������Ȩ�ޣ�û�еĻ���������Ҫ���۰�ť
	var credit = EDIT_CONFIG.sell.credit;//�������۵ĵ�λ����ͭ�ң����ֵ�
	var creditSelect = '';
	for(i in credit) {
		creditSelect += '<option value="'+ i +'">'+ credit[i] +'</option>';
	}

	var helpText = function() {//��������ϵİ�����Ϣ
		var arr = [];
		for(var i in ATTACH_CONFIG.filetype) {
			if(i) {
				arr.push(i + ':' + ATTACH_CONFIG.filetype[i] + 'kb');
			}
		}
		return arr.join('&nbsp; ');
	}();
	var	dialog = $('<div class="edit_menu" style="display:none;">\
				<div class="edit_menu_file">\
					<div class="edit_menu_top">\
						<a href="" class="edit_menu_close">�ر�</a>\
						<strong>�����ϴ�</strong>\
						<span class="edit_tips" style="left:80px;" title="���ϴ���ʽ�ʹ�С:'+ helpText +'"></span>\
					</div>\
					<div class="edit_menu_cont">\
						<div class="edit_uping">\
							<span class="num">�����ϴ�<em id="J_num"></em>��</span>\
							<span id="J_buttonPlaceHolder" ></span>\
						</div>\
						<div class="edit_menu_upfile">\
							<dl id="J_file_list">\
								<dt>\
									<span class="span_1">������</span>\
									<span class="span_2">������Ϣ</span>\
									<span class="span_3">����</span>\
								</dt>\
							</dl>\
						</div>\
					</div>\
					<div class="edit_menu_bot">\
						<button type="button" class="edit_menu_btn">ȷ��</button>\
					</div>\
				</div>\
			</div>');


	WindEditor.plugin(pluginName,function() {
		var _self = this, swfu;
		var editorDoc = _self.editorDoc = _self.iframe[0].contentWindow.document,
			plugin_icon = $('<div class="wind_icon" data-control="'+ pluginName +'"><span class="'+ pluginName +'" title="���븽��"></span></div>').appendTo(  _self.pluginsContainer  );
			//����Ǳ༭���ӣ���ô��ʾ���������еĸ���
			var file_list = ATTACH_CONFIG.list,
				has_file,
				has_file_num = 0;
			$.each(file_list,function(i,obj) {//ͼ���ϵĸ�̾��
				plugin_icon.after('<div class="wind_attachn"><span></span></div>');
				return;
			});
			//������ͼ��
			plugin_icon.on('click',function(e) {
				e.preventDefault();
				if($(this).hasClass('disabled')) {
					return;
				}
				//��ȫ������б���Ϊÿ�ε�����б�ȫ������
				dialog.find('#J_file_list > dd').remove();
				$.each(file_list,function(i,obj) {
					var is_new = obj.is_new,//�Ƿ��������ϴ��ģ�Ҳ����˵���Ǳ༭�������Դ���
						cost = obj.cost || 0,
						ctype = obj.ctype || 0,
						name = obj.name || '',
						desc = obj.desc || '',
						path = obj.path || '';
					var file_extension = name.substring(name.lastIndexOf('.') + 1,name.length);
					has_file = true;
					has_file_num ++;

					var serverData = {aid:i,path: path,is_new: is_new};

					//��Ϊ����Ҫ��ͼƬͬ���������ڲ�ˢ��ҳ�������£�ÿ���ҲҪ���¸������б�
					var att_desc_name = is_new ? 'flashatt['+ i +'][desc]' : 'oldatt_desc['+ i +']';
					var att_needrvrc_name = is_new ? 'flashatt['+ i +'][cost]' : 'oldatt_needrvrc['+ i +']';

					//��ע�����uploaded��class��ӣ�����Ϊÿ���ϴ��ĸ������ƣ�ֻ�������ϴ���ʱ��Ż���µ�ǰ�������༭������ʱ�򲻼���
					//����Ǳ༭���ӣ���ô������Ҫ�޸Ĺ���
					var modifyHtml = is_new ? '' : '<span class="modify_file"><input type="file" name="file_'+ i +'" data-id="'+ i +'"/><a data-type="modify" href="#">�޸�</a></span>';
					var sell_info = parseInt(cost) > 0 ? '<span class="sell_info">�ۼ�'+ cost + credit[ctype] +'</span>' : '';
					var item = $('\
					<dd id="file_'+ i +'" class="'+ (is_new ? 'uploaded' : 'old_uploaed') +'">\
						<span class="span_1 file_icon"><span class="file_icon_'+ file_extension +'"></span>\
							<em class="file_title">'+ (name) +'</em>\
						</span>\
						<span class="span_2"> <input type="text" class="input J_file_desc" name="'+ att_desc_name +'" placeholder="����������"  value="'+ desc +'">\
						'+ sell_info + '\
						</span>\
						<span class="span_3"><a href="#" data-type="insert">����</a>\
						'+ modifyHtml + '\
						<a href="#" data-type="del">ɾ��</a>\
						'+ (is_sell ? '<a data-type="sell" href="#">����</a>' : '') +'\
						</span>\
						<span class="span_4" style="display:none;">\
							<input class="input input_sell" name="'+ att_needrvrc_name +'" type="number" min="0" value="'+ cost +'">\
							<em><select name="oldatt_ctype['+ i +']" class="mr5 J_unit">'+ creditSelect +'</select></em><button class="J_confirm">ȷ��</button><button class="J_cancel">ȡ��</button>\
						</span>\
					</dd>').data('serverData',serverData).appendTo(dialog.find('#J_file_list'));
					item.find('option[value='+ ctype +']').attr('selected','selected');
				});
				//����Ǳ༭�����и�������ô��ʾ�и���ָʾ��
				if(has_file) {
					plugin_icon.after('<div class="wind_attachn"><span></span></div>');
				}else{
					plugin_icon.parent().find('div.wind_attachn').remove();
				}
				//����ʱ����aid�޷��ύ
				/*if(!$.contains(document.body,dialog[0]) ) {
					dialog.appendTo( document.body );*/
				if(!$.contains(_self.container[0],dialog[0]) ) {
					dialog.appendTo( _self.container );
					//�����ϴ����
					var swfupload_root = window.GV.JS_ROOT + "util_libs/swfupload/";
					Wind.js(swfupload_root + 'swfupload.js?v='+ GV.JS_VERSION, swfupload_root + 'plugins/swfupload.pluginMain.js?v=' + GV.JS_VERSION, function() {
						SWFUpload.CURSOR = {//���״̬ö��
							ARROW : -1,
							HAND : -2
						};
						var settings = {
							flash_url : swfupload_root + "Flash/swfupload.swf?v=" + GV.JS_VERSION,
							upload_url: ATTACH_CONFIG.uploadUrl+'&_json=1',//ATTACH_CONFIGΪ��ҳ���ṩ���ϴ�����
							post_params: ATTACH_CONFIG.postData,
							file_types : (function() {
								var arr = [];
								for(var i in ATTACH_CONFIG.filetype) {
									if(i) {
										arr.push('*.' + i);
									}
								}
								return arr.join(';');
							})(),
							file_types_description : "���ϴ��ĸ�������",
							//file_upload_limit : ATTACH_CONFIG.attachnum,
							//file_queue_limit : ATTACH_CONFIG.attachnum,//���ϴ����������
							debug: false,

							file_dialog_start_handler : fileDialogStart,
							file_queued_handler : fileQueued,
							//file_queue_error_handler : fileQueueError,
							file_dialog_complete_handler : fileDialogComplete,
							upload_start_handler : uploadStart,
							upload_progress_handler : uploadProgress,
							upload_error_handler : uploadError,
							upload_success_handler : uploadSuccess,
							upload_complete_handler : uploadComplete,

							// Button settings
							button_width: "80",
							button_height: "25",
							button_cursor : SWFUpload.CURSOR.HAND,
							button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
							button_image_url: swfupload_root + "button80x25.png",
							button_placeholder_id: "J_buttonPlaceHolder",
							swfupload_load_failed_handler: function(){
								//û�а�װflash���
								$("#J_buttonPlaceHolder").html('����û�а�װflash��������<a class="b u" href="http://www.adobe.com/go/getflash" target="_blank">����</a>��װ')
							}
						};
						swfu = new SWFUpload(settings);
					});
				}

				_self.showDialog(dialog);
				update_num();
			});


			//�����Ĺر��¼�
			dialog.find('a.edit_menu_close').on('click',function(e) {
				e.preventDefault();
				_self.hideDialog();
			});

			//�༭���е�Ĭ�ϸ���icon
			var default_icon = _self.options.editor_path + 'themes/default/rar.png';

			//�ϴ��ɹ������Ĳ�����ť
			dialog.on('click','.span_3 > a',function(e) {
				e.preventDefault();
				var type = $(this).data('type');
				if(type === 'insert') {
					var dd = $(this).parent().parent();
					var serverData = dd.data('serverData');
					var desc = dd.find(':text').val();
					var extName = '',html = '';
					if(serverData.path) {
						extName = serverData.path.substr(serverData.path.lastIndexOf('.')).toLowerCase();
					}
					var imgsArr = ['.jpg', '.gif', '.png', '.jpeg', '.bmp'];
					if($.inArray(extName,imgsArr) >= 0 ) {
						//�жϴ�С���ٲ���
						_self.getImgSize(serverData.path,function(width,height) {
							if(width > img_max_width) {
								width = img_max_width;
							}
							html = '<img src="'+ serverData.path +'" data-id="'+ serverData.aid +'" class="J_file_img" alt="'+ desc +'" style="width:'+  width +'px;max-width:'+ img_max_width +'"/>';
							_self.insertHTML(html);
						});
					} else {
						html = '<img src="'+ default_icon +'" class="J_file_img" alt="����" data-id="' + serverData.aid + '">';
						_self.insertHTML(html);
					}

				}else if(type === 'del') {
					var dd = $(this).parent().parent();
					var serverData = dd.data('serverData');
					var aid = serverData.aid;

					//ɾ������
					if(serverData.is_new) {
						//��һ�η����ϴ��ĸ���ֱ��ɾ��DOM
						delete file_list[serverData.aid];
						dd.remove();
						update_num();
						delFileEl(aid);
						return;
					}
					$.post(ATTACH_CONFIG.deleteUrl,{aid:aid},function(data) {
						if(data.state === 'success') {
							delete file_list[serverData.aid];
							dd.remove();
							//ATTACH_CONFIG.attachnum += 1 ;//ɾ������ϴ�����Ҫ��1
							update_num();

							
							delFileEl(aid)
						}else {
							alert(data.message);
						}
					}, 'json');
				}else if(type === 'sell') {
					var dd = $(this).parent().parent();
					dd.find('.span_4').show();
					dd.find('.span_2,.span_3').hide();
				}
			});

			function delFileEl(aid){
				//Ҫɾ����Ԫ��
				var del_el = $(editorDoc.body).find('.J_file_img[data-id='+ aid +']');
				if(del_el.length) {
					del_el.remove();
				}
			}

			//�޸ĸ�������
			dialog.on('click','#J_file_list :file',function() {

				Wind.use('ajaxForm');
				$(this).off('change').on('change',function() {
					var input = $(this),parent = input.parent(),
						id = input.data('id');
					var path = input.val(),
						ext = path.substr(path.lastIndexOf('.') + 1, path.length).toLowerCase();
					if(path == '') { return; }//ֱ��ȡ��ѡ��ʱֵΪ�գ�Ҳ�ᴥ��onchange
					if(swfu.settings.file_types.indexOf(ext) <= 0) {
						alert('�ϴ���ʽ����ȷ');
						return;
					}
					var submitAction = function() {
						//ҳ�����Ѿ���һ������ˣ������½�һ����ʱ����ҳ��ײ�
						var form = $('<form action="'+ ATTACH_CONFIG.modifyUrl +'" method="post" enctype="multipart/form-data" />').appendTo(document.body);
						input.appendTo(form);
						form.append('<input name="aid" value="'+ id +'" />');
						var options = {
						    url: ATTACH_CONFIG.modifyUrl,
						    dataType:'json',
						    //data:swfu.settings.post_params,
						    success:function(data) {
						    	//�Ѵ���value��input file�Ƴ��������һ���µģ���ΪJS����input type file��value���м���������
						    	var name = input.attr('name');
						    	var id = input.data('id');
						    	$('<input type="file" name="'+ name +'" data-id="'+ id +'"/>').prependTo(parent);
						    	form.remove();
						    	var file_detail = $('#file_'+id);
						    	file_detail.find('span.file_icon > span').attr('class','file_icon_'+ ext);
						    	//console.log(data);
						    	file_detail.find('.file_title').text(data.data.name);
						    	file_detail.data('serverData',data.data);
						    	file_detail.attr('id','file_'+id);
						    },
						    uploadProgress: function(event, position, total, percentComplete) {
								var percent = percentComplete + '%';
								var file_detail = $('#'+id);
								file_detail.find('.span_2').text(percent);//��ʾ����
								file_detail.css('backgroundPosition',-480 + percent*48 + 'px 0');
						    }
						};
						form.ajaxSubmit(options);
					}
					if(!$.fn.ajaxSubmit) {
						Wind.use('ajaxForm',function() {
							submitAction();
						});
					}else {
						submitAction();
					}
				});
			});

			//ȡ���ϴ�ĳ�������е��ļ�
			dialog.on('click','a.J_del_queue',function(e) {
				e.preventDefault();
				var dd = $(this).parent().parent();
				swfu.cancelUpload(dd.attr('id'));
				dd.fadeOut().remove();
				update_num();
			});

			//ȡ��������Ϣ
			dialog.on('click','.J_cancel',function(e) {
				e.preventDefault();
				var dd = $(this).parent().parent();
				var input = dd.find('.input_sell');
				if(parseInt(input.val()) <= 0) {
					input.val('');
				}
				dd.find('.span_4').hide();
				dd.find('.span_2,.span_3').show();
			});

			//ȷ�ϳ�����Ϣ
			dialog.on('click','.J_confirm',function(e) {
				e.preventDefault();
				var dd = $(this).parent().parent();
				var data = dd.data('serverData');
				var sell_input = dd.find('.input_sell');
				var sell_value = sell_input.val();
				if(isNaN(sell_value) || parseInt(sell_value) < 0) {
					alert('��������ȷ������');
					sell_input.focus();
					return;
				}
				var sell_unit = dd.find('.J_unit > option:selected').text();
				var sell_value = parseInt( sell_input.val(),10 );
				if(sell_value > 0) {
					var sell_info = '�ۼۣ�' + sell_value  + sell_unit;
					dd.find('.span_2').attr('title',sell_info);
					dd.find('.span_4').hide();
					var infoBox = dd.find('.span_2');
					if(infoBox.find('.sell_info').length) {
						infoBox.find('.sell_info').text(sell_info);
					}else{
						dd.find('.span_2').append('<span class="sell_info">'+ sell_info +'</span>');
					}
					file_list[data.aid]['cost'] = sell_value;
					file_list[data.aid]['ctype'] = dd.find('.J_unit').val();
				}else if(sell_value === 0) {
					file_list[data.aid]['cost'] = '0';
					file_list[data.aid]['ctype'] = dd.find('.J_unit').val();
					dd.find('.span_2').find('.sell_info').remove();
				}
				dd.find('.span_4').hide();
				dd.find('.span_2,.span_3').show();
			});

			//�ύ��ť�رյ�����
			dialog.find('.edit_menu_btn').on('click',function() {
				dialog.find('#J_file_list > dd').each(function() {
					var data = $(this).data('serverData');
					//�ݴ��������������ƣ�data�����ڻᱨ��
					if(!data){
						return;
					}
					var id = data.aid;
					var desc = $(this).find('input.J_file_desc').val();
					file_list[id].desc = desc;
				});
				_self.hideDialog();
			});

			//�л��ɿɼ�������ģʽʱ���html
			function wysiwyg() {
				var reg = /\[attachment=(\d+)\]/ig;
				var html = $(editorDoc.body).html();
				html = html.replace(reg,function(all, $1) {
					if(!file_list[$1]) {
						return;
					}
					var path = file_list[$1].path,
						extName;
					if(path) {
						extName = path.substr(path.lastIndexOf('.'));
					}
					var imgsArr = ['.jpg', '.gif', '.png', '.jpeg', '.bmp'];
					if($.inArray(extName,imgsArr) >= 0 ) {
						return '<img src="'+ path +'" data-id="'+ $1 +'" class="J_file_img" style="max-width:'+ img_max_width +'px;" onload="if(this.width > 500){this.width = 500;}"/>';
					} else {
						return '<img src="'+ default_icon +'" class="J_file_img" alt="����" data-id="' + $1 + '">';
					}
				});
				$(editorDoc.body).html(html);
			}

			//���ز��ʱ��ubbת���ɿɼ�������
			$(editorDoc).ready(function() {
				wysiwyg();
			});

			$(_self).on('afterSetContent',function(event,viewMode) {
				wysiwyg();
			});

			$(_self).on('beforeGetContent',function() {
				$(editorDoc.body).find('img.J_file_img').each(function() {
					$(this).replaceWith('[attachment='+ $(this).data('id') +']');
				});
			});



			/***********************
			   swfupload �����ϴ������е��¼�����
			 ********************** */
			function fileDialogStart() {
				/* I don't need to do anything here */
			}

			function fileQueued(file) {
				var file_list_box = $('#J_file_list');
					name = file.name,
					file_extension = name.substring(name.lastIndexOf('.') + 1,name.length).toLowerCase();
				file_list_box.append('\
					<dd style="background-position:-480px 0;" id="'+ file.id +'" class="readying">\
						<span class="span_1 file_icon">\
							<span class="file_icon_'+ file_extension +'"></span>\
							<em class="file_title">'+ file.name +'</em>\
						</span>\
						<span class="span_2"><em>�ȴ��ϴ�</em></span>\
						<span class="span_3"><span></span><a href="#" class="J_del_queue">ɾ��</a><span></span></span>\
						<span class="span_4" style="display:none;">\
							<input class="input input_sell" type="number" min="0" placeholder="������۸�">\
							<em><select class="mr5 J_unit">'+ creditSelect +'</select></em><button class="J_confirm">ȷ��</button><button class="J_cancel">ȡ��</button>\
						</span>\
					</dd>');
				var allowSize = parseInt(ATTACH_CONFIG.filetype[file_extension]) * 1024;
				var allowFileCount = parseInt(ATTACH_CONFIG.attachnum);
				var file_detail = $('#'+file.id);
				//�ж��ļ���С�Ƿ񳬹��ϴ�����
				if(allowSize && file.size > allowSize) {
					var tip = '��С������('+ allowSize/1024 +'kb)';
					file_detail.find('.span_2').html('<span style="color:red" title="'+ tip +'">'+ tip +'</span>');
					swfu.cancelUpload(file.id);
					file_detail.addClass('invalid');
				}else if(!allowSize) {
					file_detail.find('.span_2').html('<span style="color:red">�������ϴ��������ļ�</span>');
					swfu.cancelUpload(file.id);
					file_detail.addClass('invalid');
				}else if(file_list_box.find('dd.readying,dd.uploaded').size() - file_list_box.find('dd.invalid').size() > allowFileCount) {
					file_detail.find('.span_2').html('<span style="color:red">�ϴ�������������</span>');
					swfu.cancelUpload(file.id);
					file_detail.addClass('invalid');
				}
			}

			/*function fileQueueError(file, errorCode, message) {
				//return true;
			}*/

			function fileDialogComplete(numFilesSelected, numFilesQueued) {
				try {
					if (this.getStats().files_queued > 0) {
						//��ʾ���ϴ�����
						update_num();
					}
					//ѡ���ļ���ɺ��Զ��ϴ�
					this.startUpload();
				} catch (ex)  {
			       //$.error(ex);
				}
			}

			function uploadStart(file) {
				return true;
			}

			function uploadProgress(file, bytesLoaded, bytesTotal) {
				var file_detail = $('#'+file.id);
				file_detail.removeClass('readying').addClass('uploading');//
				try {
					var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
					file_detail.find('.span_2').text(percent + '%');//��ʾ����
					file_detail.css('backgroundPosition',-480 + percent*48 + 'px 0');//ʹ�ñ�������ʾ��������-480Ϊ0%��0Ϊ100%
				} catch (ex) {
					file_detail.removeClass('uploading').addClass('invalid');//
					$.error(ex);
				}
			}

			function uploadSuccess(file, serverData) {
				var json = $.parseJSON(serverData);
				if(json.state !== 'success') {
					alert(json.message);
					return;
				}
				var data = json.data;
				data.is_new = true;//is_new��ʾΪ���ϴ��ģ������Ǳ༭��
				var file_detail = $('#'+file.id);
				if(json.state !== 'success') {
					var message = json.message[0];
					file_detail.find('.span_2').html('<span style="color:red">'+message+'</span>');
					return;
				}
				file_list[''+ data['aid']] = { name : file.name, size : file.size, path : data.path, desc : '',is_new:true,thumbpath:data.thumbpath };//ͼƬ�Ż���thumbpath������û��
				file_detail.attr('id','file_' + data.aid);
				file_detail.data('serverData',data).removeClass('uploading').addClass('uploaded');
				file_detail.find('.span_2').html('<input type="text" class="input J_file_desc" value="" placeholder="����������">');
				var html = '<a href="#" data-type="insert">����</a><a href="#" data-type="del">ɾ��</a>';
				if(is_sell) {
					html += '<a data-type="sell" href="#">����</a>';//�г���Ȩ�޲Ż���������ť
				}
				file_detail.find('.span_3').html(html);
				file_detail.css('backgroundPosition','0px 0');//ʹ�ñ�������ʾ��������-480Ϊ0%��0Ϊ100%
				file_detail.find('input.input_sell').attr('name',"flashatt["+ data.aid +"][cost]");
				file_detail.find('input.J_file_desc').attr('name',"flashatt["+ data.aid +"][desc]");
				file_detail.find('select.J_unit').attr('name',"flashatt["+ data.aid +"][ctype]");
				file_detail.css('backgroundPosition','-480px 0');
				//�ϴ��ɹ��󣬵���ɸ�����
				/*file_detail.find('.file_title').on('click',function(e) {
					e.preventDefault();
					$(this).hide().next().show().focus();
				});*/
				//������ʾ���ϴ�����
				update_num();
			}
			//������ʾ���ϴ�����
			function update_num (argument) {
				dialog.find('#J_num').text(ATTACH_CONFIG.attachnum - dialog.find('dd.uploaded').size());
			}
			//�ϴ����
			function uploadComplete(file) {
				try {
					//����ϴ���ɺ󣬻���δ�ϴ��Ķ��У��Ǻͼ����Զ��ϴ�
					if (this.getStats().files_queued === 0) {
					} else {
						this.startUpload();
					}
				} catch (ex) {
					//$.error(ex);
				}
			}
			//�ϴ�����
			function uploadError(file, errorCode, message) {
				//$.error('�ϴ�����!,'+ message);
			}
	});
})( jQuery, window);