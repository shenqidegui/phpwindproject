/*
 * PHPWind WindEditor Plugin
 * @Copyright 	: Copyright 2011, phpwind.com
 * @Descript	: �ϴ�ͼƬ���
 * @Author		: chaoren1641@gmail.com
 * @Depend		: jquery.js(1.7 or later)
 * $Id: windeditor.js 4472 2012-02-19 10:41:01Z chris.chencq $			:
 */
;(function ( $, window, undefined ) {
	if(!window.ATTACH_CONFIG) {
		$.error('ATTACH_CONFIGû�ж��壬ͼƬ�ϴ���Ҫ�ṩ���ö���');
		return;
	}
	var WindEditor = window.WindEditor;
	var imgsArr = ['.jpg', '.gif', '.png', '.jpeg', '.bmp'];
	var helpText = function() {
		var arr = [];
		for(var i in IMAGE_CONFIG.filetype) {
			arr.push(i + ':' + ATTACH_CONFIG.filetype[i] + 'kb');
		}
		return arr.join('&nbsp; ');
	}();

	var pluginName = 'insertPhoto',
		dialog = $('\
		<div class="edit_menu">\
			<div class="edit_menu_photo">\
					<div class="edit_menu_top">\
						<a href="" class="edit_menu_close J_close">�ر�</a>\
						<ul>\
							<li class="J_upload_tab" data-show="J_upload"><a href="">�����ϴ�</a></li>\
							<!--<li data-show="J_upload_album"><a href="">����ϴ�</a></li>-->\
							<li data-show="J_network"><a href="">����ͼƬ</a></li>\
						</ul>\
						<span class="edit_tips" title="���ϴ���ʽ�ʹ�С '+ helpText +'"></span>\
					</div>\
				<!--==========�ϴ�==========-->\
				<div id="J_upload" class="J_tab_content J_upload_tab" style="display:none;">\
					<div class="edit_menu_cont">\
						<div class="edit_uping">\
							<span class="num">�����ϴ�<em id="J_num2"></em>��</span>\
							<span id="J_buttonPlaceHolder2" ></span>\
						</div>\
						<div class="eidt_uphoto">\
							<ul class="cc" id="J_photo_list">\
							</ul>\
						</div>\
					</div>\
					<div class="edit_menu_bot">\
						<button type="button" class="edit_menu_btn J_close">ȷ��</button><!--����༭�ɱ༭ͼƬЧ��-->\
					</div>\
				</div>\
				<!--=========���ѡ��===========-->\
				<!--<div style="display:none;" class="J_tab_content" id="J_upload_album">\
					<div class="edit_menu_cont">\
						<div class="edit_uping">\
							<select><option>Ĭ�����</option></select>\
						</div>\
						<div class="eidt_uphoto">\
							<ul class="cc">\
								<li>\
									<div class="get">\
										<img src="" width="78" height="98" />\
									</div>\
								</li>\
							</ul>\
						</div>\
					</div>\
					<div class="edit_menu_bot">\
						���ͼƬ�ɲ��뵽����\
					</div>\
				</div>-->\
				<!--=========����ͼƬ===========-->\
				<div class="edit_menu_cont J_tab_content" style="display:none;" id="J_network">\
					<div class="edit_online_photo">\
						<em>ͼƬ��ַ��</em><input name="" type="text" id="J_input_net_photo" class="input" value="" placeholder="http://">\
					</div>\
					<div class="tac mb20"><button type="button" class="edit_menu_btn" id="J_insert_net_photo">����ͼƬ</button></div>\
				</div>\
				<!--=========����===========-->\
				</div>\
			</div>');

	//����Ƿ������ÿ��ϴ���ͼƬ����
	var isAllowImg = false;
	for(var i in IMAGE_CONFIG.filetype) {
		isAllowImg = true;
		break;
	}
	//�����������û�򿪣�����û�����ÿ��ϴ�ͼƬ���ͣ���ȥ���ϴ���tab
	if(window.ATTACH_CONFIG.ifopen != '1' || !isAllowImg) {
		dialog.find('.J_upload_tab').remove();
		//Ĭ���õ�һ����ʾ
		dialog.find('div.edit_menu_top li').eq(0).addClass('current');
		dialog.find('div.J_tab_content').eq(0).show();
	}

	WindEditor.plugin(pluginName,function() {
		var _self = this, swfu;
		var editorDoc = _self.editorDoc = _self.iframe[0].contentWindow.document,
			plugin_icon = $('<div class="wind_icon" data-control="'+ pluginName +'"><span class="'+ pluginName +'" title="����ͼƬ"></span></div>').appendTo(  _self.pluginsContainer  );

		var file_list = ATTACH_CONFIG.list;
		var photo_list_ul = dialog.find('#J_photo_list');//û����ӽ�documentʱֻ����find
		plugin_icon.on('click',function() {

			if($(this).hasClass('disabled')) {
				return;
			}
			//����Ǳ༭���ӣ���ô��ʾ���������еĸ���
			var allowFileCount = ATTACH_CONFIG.attachnum,html = [];
			var has_file,
				has_file_num = 0;
			photo_list_ul.empty();//ÿ�ε�������ʱ����������Dom,��Ϊ���������ϴ���������Ҫ����
			$.each(file_list,function(i,obj) {
				var att_desc_name = obj.is_new ? 'flashatt['+ i +'][desc]' : 'oldatt_desc['+ i +']';
				//var att_needrvrc_name = obj.is_new ? 'att_needrvrc['+ i +']' : 'oldatt_needrvrc['+ i +']';
				var name = obj.name;
				has_file = true;
				has_file_num ++;
				var file_extension = name.substring(name.lastIndexOf('.'),name.length).toLowerCase();
				//�Ѹ����������ͼƬ�ĸ�����ʾ��ͼƬ����
				if($.inArray(file_extension,imgsArr) < 0) {
					//������Ĳ���ͼƬ������ʾ��ɾ��һ��ռλ��
					photo_list_ul.find('li.J_empty').eq(0).remove();
					return;
				}
				var serverData = {aid:i,path:obj.path,thumbpath:obj.thumbpath,is_new:obj.is_new};
				//��ע�����uploaded��class��ӣ�����Ϊÿ���ϴ��ĸ������ƣ�ֻ�������ϴ���ʱ��Ż���µ�ǰ�������༭������ʱ�򲻼���
				var upladedLi = $('<li class="'+ (obj.is_new ? 'uploaded' : '') +'"><div class="get">\
												<a href="" class="del">ɾ��</a>\
												<!--a href="" class="edit">�༭</a-->\
												<img alt="���ϴ���" data-id="'+ serverData.aid +'" src="'+ (serverData.thumbpath || serverData.path) +'" width="78" height="98" data-path="'+ serverData.path +'"/>\
												<input style="width:68px" placeholder="����������" type="text" name='+ att_desc_name +' value="'+ obj.desc +'" class="J_file_desc"/>\
											</div></li>').data('serverData',serverData);
				dialog.find('#J_photo_list').prepend(upladedLi);
			});

			//����Ǳ༭�����и�������ô��ʾ�и���ָʾ��
			if(has_file) {
				plugin_icon.after('<div class="wind_attachn"><span></span></div>');
			}
			//������ʾ�ϴ�����
			update_num();

			if(!$.contains(_self.container[0],dialog[0]) ) {
				dialog.appendTo( _self.container );
				//���û�и������ܻ���û������ͼƬ���ͣ���ִֹͣ�к���ͼƬ�ϴ����߼�����
				if(window.ATTACH_CONFIG.ifopen != '1' || !isAllowImg) {
					_self.showDialog(dialog);
					return;
				}

				var swfupload_root = window.GV.JS_ROOT + "util_libs/swfupload/";
				Wind.js(swfupload_root + 'swfupload.js?v=' + GV.JS_VERSION, swfupload_root + 'plugins/swfupload.pluginMain.js?v=' + GV.JS_VERSION, function() {
					SWFUpload.CURSOR = {//���״̬ö��
						ARROW : -1,
						HAND : -2
					};
					var settings = {
						flash_url : swfupload_root + "Flash/swfupload.swf",
						upload_url: ATTACH_CONFIG.uploadUrl,//ATTACH_CONFIGΪ��ҳ���ṩ���ϴ�����
						post_params: ATTACH_CONFIG.postData,
						file_types : (function() {
							var arr = [];
							for(var i in IMAGE_CONFIG.filetype) {
								if(i) {
									arr.push('*.' + i);
								}
							}
							return arr.join(';');
						})(),
						file_types_description : "���ϴ���ͼƬ����",
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
						button_image_url: swfupload_root + "button80x25.png",
						button_placeholder_id: "J_buttonPlaceHolder2",
						swfupload_load_failed_handler: function(){
							//û�а�װflash���
							$("#J_buttonPlaceHolder2").html('����û�а�װflash��������<a class="b u" href="http://www.adobe.com/go/getflash" target="_blank">����</a>��װ')
						}
					};

					swfu = new SWFUpload(settings);
				});
			}
			_self.showDialog(dialog);

		});

		//�����Ĺر��¼�
		dialog.find('.edit_menu_close').on('click',function(e) {
			e.preventDefault();
			_self.hideDialog();
		});

		//������tabѡ�
		dialog.find('.edit_menu_top li').on('click',function(e) {
			e.preventDefault();
			$(this).addClass('current').siblings().removeClass('current');
			dialog.find('.J_tab_content').hide();
			dialog.find('#'+$(this).data('show')).show();
		});
		//Ĭ���õ�һ����ʾ(����Ĭ����ʾ��һ������Ϊ����Ȩ�޲�ͬҪ��ʾ��Ҳ��ͬ������Ĭ����ʾ��һ��)
		dialog.find('div.edit_menu_top li').eq(0).addClass('current');
		dialog.find('div.J_tab_content').eq(0).show();


		//��������ͼƬ
		dialog.find('#J_insert_net_photo').on('click',function(e) {
			e.preventDefault();
			var url = $('#J_input_net_photo').val();
			if( url.indexOf('http')!== 0 ) {
				alert('·����ʽ����ȷ������������');
				return;
			}
			_self.getImgSize(url,function(width,height) {
				if(width > 500) {
					width = 500;
				}
				_self.insertHTML('<img style="width:'+ width +'px" src="'+ url +'" />');
			});
		});

		//�ϴ��õ�ͼƬ�������
		dialog.find('#J_upload').on('click', 'img', function(e) {
			e.preventDefault();
			var img = this;
			var src = $(img).attr('data-path');
			_self.getImgSize(src,function(width,height) {
				if(width > 500) {
					width = 500;
				}
				_self.insertHTML('<img class="J_file_img" data-id="'+ $(img).data('id') +'" style="width:'+ width +'px" src="'+ src +'" />');
			});
		});

		//ɾ���Ѿ��ϴ��õ�ͼƬ
		dialog.find('div.eidt_uphoto').on('click','a.del',function(e) {
			e.preventDefault();
			var li = $(this).parent().parent();
			var serverData = li.data('serverData');
			var aid = serverData.aid;
			
			if(serverData.is_new) {
				//��һ�η����ϴ��ĸ���ֱ��ɾ��DOM
				delete file_list[serverData.aid];
				li.remove();
				update_num();
				delFileEl(aid)
				return;
			}

			$.post(ATTACH_CONFIG.deleteUrl,{aid:aid},function(data) {
				if(data.state === 'success') {
					delete file_list[serverData.aid];
					li.remove();
					update_num();
					delFileEl(aid)
				}else {
					alert(data.message);
				}
			}, 'json');
		});

		function delFileEl(aid){
			//Ҫɾ����Ԫ��
			var del_el = $(editorDoc.body).find('.J_file_img[data-id='+ aid +']');
			if(del_el.length) {
				del_el.remove();
			}
		}

		//�ύ��ť�رյ�����
		dialog.find('.edit_menu_btn').on('click',function() {
			dialog.find('li div.get').each(function() {
				var data = $(this).parent().data('serverData');
				var id = data.aid;
				var desc = $(this).find('input.J_file_desc').val();
				file_list[id].desc = desc;
			});
			_self.hideDialog();
		});

		/* **********************
		   swfupload �����ϴ������е��¼�����
		   ********************** */
		function fileDialogStart() {
			/* I don't need to do anything here */
		}

		function fileQueued(file) {
			var file_list_box = $('#J_photo_list');
			//���ͼƬ��ʾλ��
			var empty_box = $('#J_photo_list > li.J_empty:eq(0)'),
				name = file.name,
				file_extension = name.substring(name.lastIndexOf('.') + 1,name.length).toLowerCase();
			var invalid = false,tip = '';
			var allowSize = parseInt(ATTACH_CONFIG.filetype[file_extension])*1024;
			var allowFileCount = parseInt(ATTACH_CONFIG.attachnum);
			if(empty_box.length) {
				//�ж��ļ���С�Ƿ񳬹��ϴ�����
				if(allowSize && file.size > allowSize) {
					tip = '��С������('+ allowSize/1024 +'kb)';
					invalid = true;
				}else if(!allowSize) {
					tip = '�������ϴ��������ļ�';
					invalid = true;
				}else if(file_list_box.find('li.uploaded,li.readying').size() - file_list_box.find('li.invalid').size() > allowFileCount) {
					tip = '�ϴ�������������';
					invalid = true;
				}else {
					invalid = false;
					empty_box.replaceWith('<li id="'+ file.id +'" class="readying"><div class="schedule"><em>0%</em><span style="width:0%;"></span></div></li>');
				}
				//�������Ч����ȡ���ϴ�
				if(invalid) {
					this.cancelUpload(file.id);
					empty_box.before('<li class="invalid"><div class="error" title="'+ tip +'">'+ tip +'<a href="javascript:;" class="del">ɾ��</a></div></li>');
				}
			}else {
				this.cancelUpload(file.id);
				tip = '�ϴ�������������';
				invalid = true;
			}

		}

		function fileQueueError(file, errorCode, message) {
			$.error(message);
		}

		function fileDialogComplete(numFilesSelected, numFilesQueued) {
			try {
				if (this.getStats().files_queued > 0) {
				}
				//ѡ���ļ���ɺ��Զ��ϴ�
				this.startUpload();
			} catch (ex)  {
		       $.error(ex);
			}
		}

		function uploadStart(file) {
			return true;
		}

		function uploadProgress(file, bytesLoaded, bytesTotal) {
			var file_detail = $('#'+file.id);
			file_detail.removeClass('readying').addClass('uploading');
			try {
				var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
				file_detail.find('em').text(percent + '%');//��ʾ����
				file_detail.find('span').css('width',percent + '%');//ʹ�ÿ������ʾ������
			} catch (ex) {
				$.error(ex);
			}
		}

		function uploadSuccess(file, serverData) {
			try {
				var file_detail = $('#'+file.id);
				var json = $.parseJSON(serverData);
				if(json.state !== 'success') {
					var message = json.message[0];
					file_detail.html('<div class="error" title="'+ message +'">'+ message +'<a href="" class="del">ɾ��</a></div>').addClass('invalid');
					return;
				}
				var data = json.data;
				data.is_new = true;//is_new��ʾΪ���ϴ��ģ������Ǳ༭��
				file_list[''+ data['aid']] = {name : file.name, size : file.size, path : data.path, desc : '',is_new : true, thumbpath:data.thumbpath };//ͼƬ��������ͼ
				file_detail.data('serverData',data).removeClass('uploading').addClass('uploaded');
				file_detail.html('<div class="get">\
											<a href="javascript:;" class="del">ɾ��</a>\
											<img title="'+ file.name +'" alt="�ϴ����" data-path="'+ data.path +'" data-id="'+ data.aid +'" src="'+ data.thumbpath +'" width="78" height="98"/>\
											<input style="width:68px" placeholder="����������" type="text" name="flashatt['+ data.aid +'][desc]" class="J_file_desc"/>\
										</div>');
				//�ϴ��ɹ��󣬵���ɸ�����
				//������ʾ���ϴ�����
				update_num();
			} catch (ex) {
				$.error(ex);
			}
		}

		function uploadComplete(file) {
			try {
				//����ϴ���ɺ󣬻���δ�ϴ��Ķ��У��Ǻͼ����Զ��ϴ�
				if (this.getStats().files_queued === 0) {
				} else {
					this.startUpload();
				}
			} catch (ex) {
				$.error(ex);
			}
		}

		function uploadError(file, errorCode, message) {
			$.error(message);
		}

		//������ʾ���ϴ�������������ͼƬ���ϴ�ռλ��
		function update_num () {
			var new_file_count = 0;
			//��Ϊ������ͼƬ�ǹ��õĸ������ƣ�����Ҫ�Ѹ��������ϴ��ļ���
			$.each(file_list,function(i,obj) {
				if(obj.is_new) {
					new_file_count ++ ;
				}
			});
			var allow_count = ATTACH_CONFIG.attachnum - new_file_count;
			if(allow_count < 0) {//�Է���������ϳ��ֿ��ϴ�����Ϊ����
				allow_count = 0;
			}
			dialog.find('#J_num2').text(allow_count);
			//��Ҫ���ͼƬ���ϴ�ռλ������
			photo_list_ul.find('li.J_empty').remove();
			var need_fill_length = allow_count - photo_list_ul.find('li.readying,li.uploading').length;
			//���ռλ
			for(var i = 0;i < need_fill_length; i++) {
				photo_list_ul.append('<li class="J_empty"><div class="no">����</div></li>');
			}
			return allow_count;
		}
	});
})( jQuery, window);