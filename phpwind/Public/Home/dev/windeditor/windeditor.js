/*
 * PHPWind WindEditor
 * @Copyright 	: Copyright 2011, phpwind.com
 * @Descript	: windeditor
 * @Author		: chaoren1641@gmail.com
 * @Depend		: jquery.js(1.7 or later)
 * $Id: windeditor.js 28780 2013-05-23 09:20:00Z hao.lin $			:
 */
;(function ( $, window, undefined ) {

	/**
	* ��������jQuery
	*/
	if( !$ ) { return ;}
	/**
	* �ж��Ƿ����ֻ������ֻ��򲻼��ر༭��
	*/
	var deviceAgent = navigator.userAgent.toLowerCase(),
		isMobile = deviceAgent.indexOf('mobile') >= 0,
		browser = $.browser,
		ie = browser.msie,
		ie6 = ie && browser.version < 7,
		mozilla = browser.mozilla,
		webkit = browser.webkit || browser.chrome,
		opera = browser.opera;
	/**
	* �ƶ�ƽ̨�����ر༭��
	*/
	if(isMobile) {
		return ;
	}

	/**
	* ie6ͼƬǿ�ƻ���
	*/
	try {
	    if(ie6) {
			document.execCommand('BackgroundImageCache', true, false);
	    }
	} catch(ex) {}

	/**
	* jsģ������(author: John Resig http://ejohn.org/blog/javascript-micro-templating/)
	*/
	var cache = {};
	var tmpl = function (str, data) {
        var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(str) :
        new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +
        "with(obj){p.push('" +
        str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
        return data ? fn(data) : fn;
    };

    /**
	* rgbת16����
	*/
    var formatColor = function(color) {
    	color = color.replace('rgba','rgb');//chrome ��ɫΪ rgba
		if (String(color).slice(0, 3) === 'rgb') {
            var ar = color.slice(4, -1).split(','),
				r = parseInt(ar[0]),
                g = parseInt(ar[1]),
                b = parseInt(ar[2]);
            return ['#', r < 16 ? '0' : '', r.toString(16), g < 16 ? '0' : '', g.toString(16), b < 16 ? '0' : '', b.toString(16)].join('');
        }
	    return color;
	}


	/**
	* ��HTML�ַ���ת����Object��ʽ������'a,b,c' > {a:true,b:true,c:true}
	*/
	var  toMap = function(str) {
		var obj = {}, items = str.split(",");
		for ( var i = 0; i < items.length; i++ ) {
			obj[ items[i] ] = true;
		}
		return obj;
	}

	//�Ƿ�鼶Ԫ��
	var isBlockTag = function(tagName) {
		//#Text�ڵ�û��tagName
		if(!tagName) {
			return false;
		}
		tagName = tagName.toLowerCase();
		var block_tag = toMap('address,applet,blockquote,body,center,dd,dir,div,dl,dt,fieldset,form,frameset,h1,h2,h3,h4,h5,h6,head,html,iframe,ins,isindex,li,map,menu,meta,noframes,noscript,object,ol,p,pre,script,style,table,tbody,td,tfoot,th,thead,title,tr,ul');
		return block_tag[tagName];
	}

	/**
	* �༭��Ĭ������
	*/
	var	defaults = {
		editor_path	: '/js/windeditor/',//editor��ŵ�Ŀ¼�����Ը���ʵ����Ŀ����
        toolbar 	: ['fontName fontSize horizontal insertTable undo redo | bold underline italic strikeThrough foreColor backColor insertLink unlink removeFormat insertBlockquote',
						'justifyLeft justifyCenter justifyRight partIndent | insertOrderedList insertUnorderedList indent outdent'						],
		mini		: 'fontName fontSize bold italic underline strikeThrough foreColor backColor justifyLeft justifyCenter justifyRight insertLink',
		defaultToolbarMode:'default',//toolbar��Ĭ����ʾģʽ����mini��Ĭ��
		toolbarSwitchable:true,		//toolbar�Ƿ���л���mini��Ĭ��
		theme		: 'default',
		lang		: 'zh-CN',
		viewMode	: 'default',	//��ǰ��ʾ��ģʽ��������default��html��ubb��Ϊ���
		codeMode	: 'html',		//Ĭ������£�����ģʽʹ��html���п���ʹ��ubb��markdown��
		iframeCss	: [],			//�༭��iframe�е�css
		initialStyle:'body {margin:0;box-sizing:border-box;font-family: Arial,Helvetica,sans-serif;word-wrap: break-word;white-space:normal;padding:5px;}img {max-width:700px;}table{clear:both;margin-bottom:10px;border-collapse:collapse;word-break: break-all;}',//����ʱ�ĳ�ʼ����ʽ
		onInit		: null, 		//��ʼ���¼�
		autoHeight	: true, 		//�Ƿ������Զ�����
		localSave	: false, 		//�Ƿ�ѵ�ǰ�༭�����ݱ����ڱ���
		fixedToolbar: true, 		//Ĭ�Ϲ������̶���ie6��ΪtrueҲû�ã�����ie6��
		undoLength	: 100, 			//��¼��ʷ���ɳ���������
		plugins		: [],			//Ĭ��ʲô���Ҳ�����أ���Ϊһ��ͨ�ñ༭��
		filterTags	: ['style','script','link','object','applet','input','meta','base','button','select','textarea','#comment','map','area'],//xss��ȫ����
		onsubmit	: $.noop

    };

	/**
	* WindEditor��
	*/
    function WindEditor( textarea, options ) {
        this.textarea = textarea;
        /**
		* �����༭��������������̬���ɵı༭���ṹ
		* <div class="wind_editor_wrap">
		* 	<div class="wind_editor_toolbar"></div>
		* 	<div class="wind_editor_body">
		*		<iframe class="wind_editor_iframe"/>
		*		<textarea/>
		*	</div>
		* 	<div class="wind_editor_statusbar"></div>
		* </div>
		*/
        this.container = null;
        this.toolbar = null;
        this.body = null;
        this.statusbar = null;
        this.iframe = null;
        this.editorDoc = null;
        this.undoStack = [];//�������У�������Դ��ĳ���������ף�
        this.undoIndex = 0; // Ĭ�ϼ�¼����Ϊ0��Ҳ����û��undo��ʷ
        this.options = $.extend( {}, defaults, options) ;
        this.viewMode = this.options.viewMode;//��¼��ǰ����ʾģʽ
        this.codeMode = this.options.codeMode;//��¼��ǰ�Ĵ���ģʽ
        this.init();
    }

    WindEditor.prototype = {
		/**
		* �༭����������
		* @link http://www.quirksmode.org/dom/execCommand.html
		*/
		controls : {
			//����ѡ��
			fontName: {
				style	: 'fontFamily',
				command	: 'fontname',
				element	: (function() {//��̬��������Ԫ��
					var fontList = {
						items:{
							'����'				: '����',
							'������' 			: '������',
							'����'				: '����',
							'����'  				: '����',
							'΢���ź�'			: '΢���ź�',
							'Arial'				: 'arial,helvetica,sans-serif',
							'Courier New'		: 'courier new,courier,monospace',
							'Georgia'			: 'georgia,times new roman,times,serif',
							'Tahoma'			: 'tahoma,arial,helvetica,sans-serif',
							'Times New Roman'	: 'times new roman,times,serif',
							'Verdana'			: 'verdana,arial,helvetica,sans-serif',
							'impact'			: 'impact'
						},
						defaultItem:'Arial'
					};
					var template = '<div style="float:left" data-control="fontName" class="wind_dropdown">\
										<div style="float:left;margin-top:21px;">\
											<div class="edit_menu" style="display:none">\
												<ul class="edit_menu_select">\
													<% for(var i in items) { %>\
													<li unselectable="on" data-value="<%=items[i]%>"><a href="" style="font-family:<%=i%>" unselectable="on"><%=i%></a></li>\
													<% } %>\
												</ul>\
											</div>\
										</div>\
										<div class="wind_select" style="width:102px;"><span unselectable="on" class="fontName" title="��������"><%=defaultItem%></span></div>\
									</div>';
					return $( tmpl(template,fontList) );
				})(),
				bindEvent:function(control) {
					var _self = this,
						elem = control.element,
						menu = elem.find('.edit_menu'),
						select = elem.find('.wind_select');
					select.on('click',function(e) {
						e.preventDefault();
						menu.show();
					});
					elem.find('.edit_menu_select li').on('click',function(e) {
						e.preventDefault();
						var fontName = $(this).data('value');
						_self.execCommand('FontName',false,fontName);
						menu.hide();
						select.find('span').text(fontName);
					});
					//��������ط����ز˵�
			        $(document.body).on('mousedown',function(e) {
			        	if( !$.contains(elem[0],e.target) ) {
			        		menu.hide();
			        	}
			        });
				},
				exec:function(control) {
					var elem = control.element;
					elem.find('.wind_select').trigger('click');
				}
			},
			//�����С
			fontSize: {
				command	: 'fontsize',
				style 	: 'fontSize',
				element	: (function() {
					var sizeList = {
						items:{'Ĭ��':'normal','10':'1','12':'2','16':'3','18':'4','24':'5','32':'6','48':'7'},
						defaultItem:'14'
					},
					template = '<div style="float:left" data-control="fontSize" class="wind_dropdown">\
									<div style="float:left;margin-top:21px;">\
										<div class="edit_menu" style="display:none;">\
											<ul class="edit_menu_select" style="width:75px;">\
												<% for(var i in items) { %>\
												<li unselectable="on" title="<%=i%>����" data-value="<%=items[i]%>"><a href="" style="font-size:<%=i%>px" unselectable="on"><%=i%></a></li>\
												<% } %>\
											</ul>\
										</div>\
									</div>\
									<div class="wind_select" style="width:38px;"><span  unselectable="on" class="fontSize" title="���������С"><%=defaultItem%></span></div>\
								</div>';
					return $( tmpl(template,sizeList) );
				})(),
				bindEvent:function(control) {
					var _self = this,
						elem = control.element,
						menu = elem.find('.edit_menu'),
						select = elem.find('.wind_select');
					select.on('click',function(e) {
						e.preventDefault();
						_self.toolbar.find('.edit_menu').hide();
						menu.show();
					});
					elem.find('.edit_menu_select li').on('click',function(e) {
						e.preventDefault();
						var fontSize = $(this).data('value'),fontText = $(this).text();

						if(fontSize == 'normal' && !ie) {
							//��ie �ָ�Ĭ��
							var rhtml = _self.getRangeHTML(),
								rex = /(<font size="[1-7]{1}">)|(<\/font>)/g;
							if(rex.test(rhtml)) {
								rhtml = rhtml.replace(rex, '');
								_self.insertHTML(rhtml);
							}
						}else{
							_self.execCommand(control.command,false,fontSize);
						}
						
						menu.hide();
						select.find('span').text(fontText);
					});
					//��������ط����ز˵�
			        $(document.body).on('mousedown',function(e) {
			        	if( !$.contains(elem[0],e.target) ) {
			        		menu.hide();
			        	}
			        });
				},
				exec:function(control) {
					var elem = control.element;
					elem.find('.wind_select').trigger('click');
				}
			},

			horizontal: {
				command	: 'inserthorizontalrule',
				tags: ['hr'],
				tooltip: '�ָ���',
				exec: function(){
					this.insertHTML('<hr>');
				}
			},

			bold: {
				command	: 'bold',
				tags: ["b", "strong"],
				css: {
					fontWeight: "bold"
				},
				tooltip: '�Ӵ�'
			},

			strikeThrough: {
				command : 'strikeThrough',
				tags: ['s','del','strike'],
				css: { textDecoration: 'line-through' },
				tooltip: 'ɾ����'
			},

			italic: {
				command : 'italic',
				tags: ['i','em'],
				tooltip: 'б��',
				css: { fontStyle: 'italic' }
			},

			underline: {
				command : 'underline',
				tag: ['u'],
				css: { textDecoration: 'underline' },
				tooltip: '�»���'
			},

			foreColor: {
				command : 'forecolor',
				tooltip: '������ɫ',
				element:(function() {
					return $('<div class="wind_icon J_toolbar_control_ignore" data-control="foreColor" unselectable="on"><span class="foreColor" title="������ɫ"><em class="edit_acolorlump" style="background:#FF0000;" unselectable="on"></em></span><em class="edit_arrow" unselectable="on"></em></div>');
				})(),
				bindEvent:function(control) {
					var _self = this,
						element = control.element;
					element.find('em.edit_arrow').on('click',function(e) {
						e.preventDefault();
						var height = element.height(),
							offset = element.offset(),
							left = offset.left,
							top = offset.top,
							colorPanel = _self.colorPanel();
						colorPanel.css({left:left, top:top + height}).show();
						colorPanel.unbind('mousedown').bind('mousedown',function(e) {
							e.preventDefault();
							if(e.target.nodeName === 'STRONG') {
								var color = formatColor(e.target.style.backgroundColor);
								_self.execCommand(control.command,null,color);
								element.find('.edit_acolorlump').css('backgroundColor',color);
							}else if(e.target.className === 'color_initialize') {
								var color = '#000000'; //Ĭ����ɫ
								_self.execCommand(control.command, null, color);
								element.find('.edit_acolorlump').css('backgroundColor',color);
							}
							colorPanel.hide();
						});
					});
					element.find('span.foreColor').on('click',function(e) {
						e.preventDefault();
						var color = formatColor( $(this).find('.edit_acolorlump').css('backgroundColor') );
						_self.execCommand(control.command,null,color);
					});
				}
			},

			backColor:{
				command : ie ? 'backColor' :'hilitecolor',
				tooltip: '����ɫ',
				element:(function() {
					return $('<div class="wind_icon J_toolbar_control_ignore" data-control="backColor" unselectable="on"><span class="backColor" title="����ɫ" unselectable="on"><em class="edit_acolorlump" style="background:#FFFF00;"></em></span><em class="edit_arrow" unselectable="on"></em></div>');
				})(),
				bindEvent:function(control) {
					var _self = this,
						element = control.element;
					element.find('.edit_arrow').on('click',function(e) {
						var height = element.height(),
							offset = element.offset(),
							left = offset.left,
							top = offset.top,
							colorPanel = _self.colorPanel();
						colorPanel.css({left:left, top:top + height}).show();
						colorPanel.unbind('mousedown').bind('mousedown',function(e) {
							e.preventDefault();
							if(e.target.nodeName === 'STRONG') {
								var color = formatColor(e.target.style.backgroundColor);
								_self.execCommand(control.command,null,color);
								element.find('.edit_acolorlump').css('backgroundColor',color);
							}else if(e.target.className === 'color_initialize') {
								var color = '#fff'; //Ĭ����ɫ
								/*if(webkit) { //webkit��execCommand�޷�����rgba
									color = '#ffffff';
								}*/
								_self.execCommand(control.command, false, color);
								element.find('.edit_acolorlump').css('backgroundColor',color);
							}
							colorPanel.hide();
						});
					});
					element.find('.backColor').on('click',function() {
						var color = formatColor( $(this).find('.edit_acolorlump').css('backgroundColor') );
						_self.execCommand(control.command,null,color);
					});
				}
			},

			insertOrderedList: {
				command : 'insertOrderedList',
				tags: ['ol'],
				tooltip: '�����б�'
			},

			insertUnorderedList: {
				command : 'insertUnorderedList',
				tags: ['ul'],
				tooltip: '�����б�'
			},

			justifyCenter: {
				command : 'justifyCenter',
				tags: ['center'],
				css: { textAlign: 'center' },
				tooltip: '���ж���'
			},

			/*justifyFull: {
				command : 'justifyFull',
				css: { textAlign: 'justify' },
				tooltip: '���߶���'
			},*/
			justifyLeft: {
				command : 'justifyLeft',
				css: { textAlign: 'left' },
				tooltip: '�����'
			},

			justifyRight: {
				command : 'justifyRight',
				css: { textAlign: 'right' },
				tooltip: '�Ҷ���'
			},

			partIndent:{
				tooltip: '��������',
				exec:function() {
					var node = this.editorDoc.getElementById('J_partIndent');
					if(node) {
						$(node).replaceWith(node.innerHTML);
					}else{
						$(this.editorDoc.body).wrapInner('<div id="J_partIndent" style="text-indent:2em;"/>');
					}
				}
			},

			indent: {
				tags:['blockquote'],
				command : 'indent',
				tooltip: '����',
				css: { textIndent: '2em' }

			},

			outdent: {
				command : 'outdent',
				tooltip: 'ȡ������'
			},


			subscript: {
				command : 'subscript',
				tags: ['sub'],
				tooltip: '�±�'
			},

			superscript: {
				command : 'superscript',
				tags: ['sup'],
				tooltip: '�ϱ�'
			},

			removeFormat: {
				exec: function (control) {
					this.execCommand("removeFormat");
					this.execCommand("unlink");
					if(webkit) {//webkit Ĭ�ϲ����������ɫ
						this.execCommand("hilitecolor", false, "transparent");
					}
				},
				tooltip: "�����ʽ"
			},

			undo: {
				exec:function(control) {

					var undoStack = this.undoStack,
						undoIndex = this.undoIndex;
					if(undoIndex > 1) {
						this.undoIndex--;
						var stack = undoStack[this.undoIndex-1];
						this.editorDoc.body.innerHTML = stack.html;
						var range = stack.range;
						//��ԭrange
						this.restoreRange(range);
					}
				},
				tooltip: '����'
			},

			redo: {
				exec:function(control) {
					var undoStack = this.undoStack,
						undoIndex = this.undoIndex;
					if(undoStack.length > undoIndex) {
						this.undoIndex++;
						var stack = undoStack[this.undoIndex-1];
						this.editorDoc.body.innerHTML = stack.html;
						var range = stack.range;
						this.restoreRange(range);
					}
				},
				tooltip: '����'
			},

			unlink:{
				command:'unlink',
				tooltip: 'ȡ������'
			},
			//��������
			insertLink: {
				tags:['a'],
				exec:function(control) {
					var _self = this,
						LinkPanel = _self.insertLinkPanel(),
						form = LinkPanel.find('form'),

						titleInput = form.find('.J_title'),
						urlInput = form.find('.J_url');
						//��������ӱ༭�����ҵ���ǰ������
					var node = $(_self.getRangeNode('a')),
						rhtml = _self.getRangeHTML();
					if(node.length) {
						/*if(node.find('img').length) {
							titleInput.val(node.html());
						}else{
							titleInput.val(node.text());
						}*/
						titleInput.val(node.text());
						var href = node.attr('href');
						urlInput.val(href)
					}/*else if(/<img /.test(rhtml)) {
						TODO:ͼƬ������  ��˽��� public function parsePicHtml($att)
						//ѡ��ͼƬ
						form[0].reset();
						titleInput.val(rhtml);
					}*/else {
						form[0].reset();
						titleInput.val(_self.getRangeText());//����ȡ��ǰѡ�е��ı�
					}
					_self.showDialog(LinkPanel);

					LinkPanel.find('.edit_menu_btn').unbind('click').bind('click',function(e) {
					 	var title = titleInput.val(),
					 		url = urlInput.val();
					 	if(!url || !title) {
					 		alert('��������������');
					 		urlInput.focus();
					 		return;
					 	}
					 	var protocols = ['https','http','ftp','ed2k','thunder'];
					 	var hasProtocols = false;
					 	for(var i = 0;i< protocols.length;i++) {
					 		if(url.toLowerCase().indexOf(protocols[i]) == 0) {
					 			hasProtocols = true;
					 		}
					 	}
					 	if(!hasProtocols) {//���û������http����https�������Э�飬���򲻼�
					 		url = 'http://' + url;
					 	}
					 	if(url && title) {
					 		//script xss
					 		var goal = $('<a href="'+ url +'" target="_blank" />').text(title);
					 		var snap = $('<div />').html(goal);
					 		_self.insertHTML(snap.html());
					 	}else {
					 		_self.execCommand("unlink");
					 	}
					 	_self.hideDialog();
					});
				},
				tags: ['a'],
				tooltip: '��������'
			},

			//������
			insertTable:{
				tags: ['table'],
				exec:function(control) {
					var _self = this,
						is_insert = true,//������༭,Ĭ������
						tablePanel = _self.insertTablePanel(),
						form = tablePanel.find('form'),
						//������ÿ��ȡ
						rowsCountInput = form.find('input.J_rowsCount'),//����
						tableWidthInput = form.find('input.J_width'),//�����
						colsCountInput = form.find('input.J_colsCount'),//����
						borderInput = form.find('input.J_border'),//���߿�
						paddingInput = form.find('input.J_padding'),//�ڼ��
						borderColorInput = form.find('input.J_borderColor'),//�߿���ɫ
						backgroundColorInput = form.find('input.J_backgroundColor'),//������ɫ
						tableAlignSelect = form.find('select.J_tableAlign'),//�����뷽ʽ
						colAlignSelect = form.find('select.J_colAlign');//�����뷽ʽ
					//����Ǳ��༭�����ҵ���ǰ�ı��
					_self.showDialog(tablePanel);
					var node = _self.getRangeNode('table');
					if(node && node.length) {
						is_insert = false;
						var table = node[0];
						//�༭���ʱ���ܱ༭�к���
						rowsCountInput.val(table.rows.length).prop('disabled',true);
						colsCountInput.val(table.rows[0].cells.length).prop('disabled',true);
						borderInput.val(table.getAttribute('border'));
						tableWidthInput.val(table.getAttribute('width'));
						paddingInput.val(table.getAttribute('cellpadding'));
						borderColorInput.val(table.getAttribute('borderColor'));
						backgroundColorInput.val(table.getAttribute('bgColor'));
						tableAlignSelect.find('option[value='+ table.getAttribute('align')+']').attr('selected','selected');
						//colAlignSelect.find('options[value='+ table.align +']').attr('selected','selected');
					}else {
						rowsCountInput.prop('disabled',false);
						colsCountInput.prop('disabled',false);
						form[0].reset();
					}
					tablePanel.find('.edit_menu_btn').unbind('click').bind('click',function(e) {
						var rowsCount = rowsCountInput.val(),
							tableWidth = tableWidthInput.val() || '100%',
							colsCount = colsCountInput.val(),
							border  = borderInput.val() || '1',
							padding = paddingInput.val() || '0',
							borderColor = borderColorInput.val() || '#dddddd',
							backgroundColor = backgroundColorInput.val() || '#ffffff',
							tableAlign = tableAlignSelect.find('option:selected').val() || '',
							colAlign = colAlignSelect.val();
							//���ɱ�񲢲���
							if (Number(rowsCount) < 1 || Number(colsCount) < 1) {
								alert('��������ȷ������������');return;
							}
							var html = ['<table width="'+ tableWidth +'" border="'+ border +'" align="'+ tableAlign +'" cellpadding="'+ padding +'" bordercolor="'+ borderColor +'" bgcolor="'+ backgroundColor +'"><tbody>'],
							i,j;
							for(i = 0;i < rowsCount; i++) {
								html.push('<tr>');
								for(j = 0;j < colsCount;j++) {
									html.push('<td style="width:'+ (100/colsCount).toFixed(2) +'%"><br/></td>');
								}
								html.push('</tr>');
							}
							html.push('</tbody></table>');
							if(is_insert) {
								_self.insertHTML(html.join(''));
							}else {
								var table = node[0];
								table.setAttribute('border',border);
								table.setAttribute('width',tableWidth);
								table.setAttribute('cellpadding',padding);
								table.setAttribute('borderColor',borderColor);
								table.setAttribute('bgColor',backgroundColor);
								table.setAttribute('align',tableAlign);
							}
							_self.hideDialog().focus();
					});
				},
				tooltip: "������"
			},

			insertBlockquote: {
				selector: 'blockquote.blockquote',
				tooltip: '��������',
				exec:function(control) {
					var node = this.getRangeNode('blockquote.blockquote'),
						html = this.getRangeHTML();
					if (node && node.length) {
						node.replaceWith(node.html());
					} else if(html) {
						this.insertHTML('<blockquote class="blockquote">'+ html +'</blockquote>');
					} else {
						var id = 'blockquote' + $.guid++;
						this.insertHTML('<blockquote class="blockquote" id="'+ id +'">&nbsp;</blockquote>');
						this.setFocus( $( this.editorDoc.getElementById(id) ) );
					}
				}
			}
		},

		/**
		* ��ɫѡ�����
		*/
		colorPanel : function() {
			var _self = this,
				colorPanel = $('.editor_color_panel');
			//����Ѿ�����ɫѡ��������ôֱ�ӷ���֮
			if(colorPanel.length) {
				return colorPanel;
			}
			var pre = '<strong style="background-color:#',
				suf = ';" unselectable="on"><span></span></strong>';
			var htmlGen = [pre, 'ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646'.split(',').join(suf + pre), suf].join('');

			var htmlList = [pre, 'f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,d8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806'.split(',').join(suf + pre), suf].join('');

			var htmlStandard = [pre, 'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0'.split(',').join(suf + pre), suf].join('');

			var htmlGeneralPanel = ['<div class="editor_color_panel edit_menu" style="display:none;z-index:12;" editor_color_panel unselectable="on"><div class="color_initialize" unselectable="on"><em unselectable="on">��</em>�ָ�Ĭ��</div><div class="color_general" unselectable="on">', htmlGen, '</div><div class="color_list" unselectable="on">', htmlList, '</div><div class="color_standard" unselectable="on">', htmlStandard, '</div></div>'].join('');

			colorPanel = $( htmlGeneralPanel ).appendTo( document.body );
			$(document.body).on('mousedown',function(e) {
				if( !$.contains(colorPanel[0],e.target) && colorPanel.is(':visible') ) {
					colorPanel.hide();
				}
			});
			$( _self.editorDoc.body ).on('mousedown',function() {
				colorPanel.hide();
			});

			$(window).on('scroll',function() {
				setTimeout(function() {
					colorPanel.hide();
				},16);
			});
			return colorPanel;
		},

		/**
		* ���������
		*/
		insertTablePanel:function(){
			var _self = this,
				insertTablePanel = _self.toolbar.find('div.editor_table_panel');
			if(insertTablePanel.length) {
				return insertTablePanel;
			}
			var html = '<div class="edit_menu editor_table_panel" style="display:none">\
							<div class="edit_menu_insertTable">\
								<div class="edit_menu_top">\
									<a href="" class="edit_menu_close">�ر�</a>\
									<strong>������</strong>\
								</div>\
								<form>\
									<div class="edit_menu_cont">\
										<ul class="cc">\
											<li><em>����</em><input name="" type="number" class="input J_rowsCount" min="1" max="100" value="5"></li>\
											<li><em>����</em><input name="" type="number" class="input J_colsCount" min="1" max="100" value="5"></li>\
											<li><em>�����</em><input name="" type="number" class="input J_width" min="1" max="100">px</li>\
											<li><em>���߿�</em><input name="" type="number" class="input J_border" min="1" max="100" value="1">px</li>\
											<li><em>�߿���ɫ</em><input name="" type="text" class="input J_colorPicker J_borderColor" ></li>\
											<li><em>������ɫ</em><input name="" type="text" class="input J_colorPicker J_backgroundColor"></li>\
											<li><em>�ڼ��</em><input name="" type="number" class="input J_padding" min="1" max="100" value="0">px</li>\
											<li><em>������</em>\
												<select class="J_tableAlign">\
												<option value="">Ĭ��</option>\
												<option value="left">����</option>\
												<option value="center">����</option>\
												<option value="right">����</option>\
												</select>\
											</li>\
											<!--<li><em>���ݶ���</em>\
												<select class="J_colAlign">\
												<option value="left">�����</option>\
												<option value="center">����</option>\
												<option value="right">�Ҷ���</option>\
												</select>\
											</li>-->\
										</ul>\
									</div>\
								</form>\
								<div class="edit_menu_bot">\
									<button type="button" class="edit_menu_btn">ȷ��</button>\
									<button type="button" class="edit_btn_cancel">ȡ��</button>\
								</div>\
							</div>\
						</div>';
			var panel =  $( html );
			panel.find('a.edit_menu_close,button.edit_btn_cancel').on('click',function(e) {
				e.preventDefault();
				_self.hideDialog();
			});

			//rgbת��ΪHEX��
		    function uniform(color) {
		        if (String(color).slice(0, 3) == 'rgb') {
		            var ar = color.slice(4, -1).split(','),
		                r = parseInt(ar[0]),
		                g = parseInt(ar[1]),
		                b = parseInt(ar[2]);
		            return ['#', r < 16 ? '0' : '', r.toString(16), g < 16 ? '0' : '', g.toString(16), b < 16 ? '0' : '', b.toString(16)].join('');
		        }
		        return color;
		    }

			panel.find('input.J_colorPicker').on('focus click',function(e) {
				e.preventDefault();
				var input = this;
				var height = $(input).outerHeight(),
					offset = $(input).offset(),
					left = offset.left,top = offset.top,
					colorPanel = _self.colorPanel();
					colorPanel.css({left:left, top:top + height}).show();
					colorPanel.unbind('mousedown').bind('mousedown',function(e) {
						if(e.target.nodeName === 'STRONG') {
							var color = e.target.style.backgroundColor;
							$(input).val( uniform(color) );
						}else if($(e.target).hasClass('color_initialize')) {
							$(input).val('');
						}
						colorPanel.hide();
					});
			});
			//��ק
			//_self.dragdorp(panel);
			return panel.appendTo( document.body );
		},

		/**
		* ���Ӳ������
		*/
		insertLinkPanel:function(){
			var _self = this,
				insertLinkPanel = $('div.editor_Link_panel');
			if(insertLinkPanel.length) {
				return insertLinkPanel;
			}
			var html = '<div class="edit_menu_insertLink edit_menu" style="display:none;">\
							<div class="edit_menu_top">\
								<a href="" class="edit_menu_close">�ر�</a>\
								<strong>��������</strong>\
							</div>\
							<form>\
								<div class="edit_menu_cont">\
									<dl class="cc http_dl">\
										<dt>��ַ��</dt>\
										<dd>\
											<input name="" type="url" placeholder="��������Ч�����ӵ�ַ" class="input J_url length_6">\
										</dd>\
									</dl>\
									<dl class="cc">\
										<dt>���⣺</dt>\
										<dd><input type="text" class="input length_6 J_title"></dd>\
									</dl>\
									<!--<dl class="cc">\
										<dt>���ã�</dt>\
										dd>\
											<label><input type="checkbox" value="" class="J_isDownload">��Ϊ��������</label>\
										</dd>\
									</dl-->\
								</div>\
							</form>\
							<div class="edit_menu_bot">\
								<button type="button" class="edit_menu_btn">ȷ��</button>\
								<button type="button" class="edit_btn_cancel">ȡ��</button>\
							</div>\
						</div>';
			var panel =  $( html );
			panel.find('a.edit_menu_close,.edit_btn_cancel').on('click',function(e) {
				e.preventDefault();
				_self.hideDialog();
			});
			//��ק
			//_self.dragdorp(panel);
			return panel.appendTo( document.body );
		},

		/**
		* �༭����ʼ��
		*/
		init:function() {
			//����Ƥ��
			this.loadTheme( this.options.theme );

			var _self = this,
				textarea = _self.textarea,
				options = _self.options,
				width = textarea.width(),
				height = _self.textarea.height();
			_self.container = $('<div class="wind_editor_wrap" dir="ltr" accesskey="p"></div>').appendTo( textarea.parent() ).css( {'width': width + 'px' });
			_self.toolbar = $('<div class="wind_editor_toolbar" style="position:relative;" data-mode="default" unselectable="on" role="presentation" onmousedown="return false;"/>').appendTo( _self.container );
			_self.body = $('<div class="wind_editor_body" role="presentation"/>').appendTo( _self.container ).css( { height : height + 'px' } );
			_self.statusbar = $('<div class="wind_editor_statusbar" role="presentation"/>').appendTo( _self.container );
			_self.iframe = $('<iframe class="wind_editor_iframe" style="height:100%" frameborder="0" width="100%" title="���������ñ༭��" allowTransparency="true"/>').appendTo( _self.body );
			textarea.addClass('wind_editor_textarea').css('font-size','14px').appendTo( _self.body );
			_self.codeContainer = textarea;//��������,��һ��Ҫ��textarea���ڲ�����п��ܱ��滻

			//����Ĭ����ʾģʽ��ʾ
			if( _self.viewMode !== 'default' ) {
				_self.iframe.hide();
			}else {
				textarea.hide();
			}

			var editorDoc = _self.editorDoc = _self.iframe[0].contentWindow.document || _self.iframe[0].contentDocument;
			//editorDoc.designMode = 'on';
			editorDoc.open();
			var iframeCss_str = (function() {
				var str = [];
				for(var i = 0,j = options.iframeCss.length; i < j; i++) {
					str.push('<link rel="stylesheet" type="text/css" href="' + options.iframeCss[i] + '"/>');
				}
				return str.join('');
			})() || '';

			editorDoc.write('<html><head><title>���ѽ���༭���༭������control+�س����Կ����ύ���ݣ���Tab�����˳���ǰ���㣬��Shift+Tab���Է�����һ������</title>' + iframeCss_str +
                '<style type="text/css">'+ options.initialStyle +'</style></head><body contenteditable="true">' + (ie ? '' : '<br/>' ) + '</body></html>' );

			editorDoc.close();
			if(!ie) {
				editorDoc.body.spellcheck = false;
			}
			var val = _self.textarea.val();
			if(val === '' && _self.options.localSave) {
				//����Ƿ���δ����ȥ�Ĳݸ�
				setTimeout(function() {
					var local_draft = _self.localStorage.get('windeditor');
					if(local_draft) {
						var contentTip = $('<div class="restore_tip_wrap" tabindex="0" role="tooltip" aria-label="���ϴ���δ���������"><p><a class="restore_tip_close J_local_close" href="javascript:void(0)" role="button">�ر�</a>���ϴ���δ��������� <a class="J_local_restore" href="javascript:void(0)" role="button">�ָ�����</a> <a role="button" class="J_local_cancel" href="javascript:void(0)">ȡ��</a></p></div>');
						contentTip.insertBefore(_self.iframe);
						//�ر�
						$(_self.body).on('mousedown.restore', '.restore_tip_close', function(e){
							e.preventDefault();
							contentTip.remove();
							_self.focus();
							_self.clear_local_data();
						});
						//�ָ�
						$(_self.body).on('mousedown.restore', '.J_local_restore', function(e){
							e.preventDefault();
							contentTip.remove();
							_self.focus();
							$(_self).trigger('setContenting',[local_draft]);
						});
						//ȡ��
						$(_self.body).on('mousedown.restore', '.J_local_cancel', function(e){
							e.preventDefault();
							contentTip.remove();
							_self.focus();
							_self.clear_local_data();
						});
					}
					//_self.setFocus($(editorDoc.body));
				},1000);
			}else {
				$(_self).trigger('setContenting',[val]);
			}

			if (options.css) {
			    $('<link href="'+ options.css +'" rel="stylesheet"/>').appendTo( $(editorDoc.head[0]) );
			}

			//�ύʱ��ͬ������
			var form = $(_self.textarea.prop('form')),interVal;
			//��ʱ���������ڱ����������
			if(_self.options.localSave) {
				interVal = setInterval(function() {
					//���༭�����ı�Ϊ��ʱ��ִ��
					var text = _self.getContentTxt();
					if(text.replace(/\s+/, '') === ''){
						return
					}
					//!TODO:���ʵ���༭��ʱ������ʹ��ͬһ��localStorage����
					var html = editorDoc.body.innerHTML;
					_self.localStorage.set('windeditor',html);
				},3000);
			}

			if( form.length ) {
				var submit = function(e) {
					e.preventDefault();
					_self.saveContent();
					clearInterval(interVal);
					options.onsubmit.call(_self);
				}
				form.on('submit',submit);
				//����jquery������¼�����˳��jq1.8��_data��֮ǰ�汾ֱ��$.data
				$._data(form[0],'events').submit.reverse();
			}

			//�༭��������¼��󶨺͵ײ�״̬��
			setTimeout(function() {
				_self.initEvent();
				_self.initStatusbar();
			},10);

			_self.initToolbar();//��ʼ��������
			setTimeout(function(){
				_self.initHotkey();//��ʼ����ݼ�
			},16);
			_self.options.onInit && _self.options.onInit.call(_self);
			//���������в�������һ����ʷ��¼���Ա�undo����
			setTimeout(function() {
				_self.loadPlugins(function() {
					_self.setDisabled('undo','redo');//����ʱ��undo��redo����,��Ϊû����ʷ��¼
					setTimeout(function() {
						_self.addToUndoStack();//����ʱ���һ����ʷ��¼��undo������
						var lastChild = _self.editorDoc.body.lastChild;
						//����ǿ鼶Ԫ�أ���������һ��BR����ֹ�������������
						if( lastChild && ( isBlockTag(lastChild.tagName) || lastChild.nodeType == 3) ) {
							if(ie && $.browser.version < 8) {
								$(_self.editorDoc.body).append(' ');
							}else {
								$(_self.editorDoc.body).append('<br/>');
							}
						}
					},200);
				});
			});
		},

		/**
		* ����ָ����Ƥ��
		*/
		loadTheme:function(themeName) {
			$('link.windeditor_theme').remove();
			var url = this.options.editor_path + 'themes/' + themeName + '/' + themeName + '.css?v=' + GV.JS_VERSION;
			$('<link href="'+ url +'" class="windeditor_theme" rel="stylesheet"/>').appendTo( $('head') );
			return this;
		},

		/**
		* �����򵯳�
		*/
		showDialog:function(element) {
			var _self = this;
			_self.hideDialog();
			if( !element.data('draggable') ) {
				_self.dragdorp(element);
				element.data('draggable',true)
			}
			var top = _self.toolbar.offset().top;
			var height = _self.toolbar.height();
			var dialogTop = top + height;
			var scrollTimer;
			element.css({
������������		position:'absolute',
			zIndex:'7',
			top: ( $(window).height() - element.height() ) / 2 + $(window).scrollTop() + 'px',
������������		left:( $(window).width() - element.width() ) / 2 + $(window).scrollLeft() + 'px',
			display:''
��������		}).attr({'aria-labelledby':"alert_title",'tabindex':'0','aria-label':'�༭��������������ESC�رյ���'});
			$(window).on('resize.showDialog',function() {
				setTimeout(function() {
					element.css({
		������������		left:( $(window).width() - element.width() ) / 2 + $(window).scrollLeft() + 'px',
						display:''
		��������		});
				},64);
			}).on('scroll.showDialog', function(){
				//��������߶�
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(function() {
                    if(element.is(':visible')) {
                        element.css({
							top : ($(window).height() - element.height()) / 2 + $(window).scrollTop()
						});
                    }
                },64);
			});
		},

		/**
		* �رյ���
		*/
		hideDialog:function() {
			$('div.edit_menu').hide();
			this.focus();
			$(window).off('.showDialog');
			return this;
		},

		/**
		* �༭��������¼���
		*/
		initEvent:function() {
			var _self = this,
				editorDoc = _self.editorDoc,
				rng,
				undoTimer;
			$(editorDoc.body).on({
				keydown	: function(e) {
					if(ie) {//ie��ѡ��ͼƬ���backspaceʱ�����⴦��
						var rangeNode = _self.getRangeNode();
						if(rangeNode.length && rangeNode[0].tagName === 'IMG') {
							e.preventDefault();
							rangeNode.remove();
						}
					}
				},
				keyup	: function(e) {
					clearTimeout(undoTimer);
					undoTimer = setTimeout(function() {
						_self.addToUndoStack();
						_self.updateToolbar();
					}, 200);
				},
				paste:function(e) {
					//e.preventDefault();
					//var html = _self.filterHTML();
					if(ie) {
						_self.pasteCache4IE(e);
					}else {
						_self.pasteCache(e);
					}
					_self.addToUndoStack();
				},
				click: function(e) {

				},
				mousedown:function(e) {
					if(e.target.tagName === 'IMG') {
						if(!ie) {//��IEѡ��ͼƬ��IEѡ����
							_self.selectNode( $(e.target) );
						}
					}
					//���ʱ���¹�����״̬
					setTimeout(function() {
						_self.updateToolbar();
						//_self.hideDialog();
						_self.toolbar.find('.edit_menu').hide()
					},64);
				},
				mouseup:function() {
				},
				focus:function(e) {
					_self.updateToolbar();
				}
			});

			// ��¼��ǰѡ����ie��ʹ��beforedeactivate�¼����洢ѡ��
            if (ie) {
				var range;
				//��¼IE�ı༭���
				_self.iframe.bind('beforedeactivate',function() {//���ĵ�ʧȥ����֮ǰ
					range = _self.getRange();
				});
				//�ָ�IE�ı༭���
				_self.iframe.bind('activate',function() {
					if(range && range.select) {
						try{
							range.select();
							range = null;
						}catch(e){
						}
					}
				});

            }
            //�Զ�����
			if(_self.options.autoHeight) {
				var body = $(_self.editorDoc.body);
				$(_self.editorDoc.documentElement).css('overflowY','hidden');
				body.css('overflowY','hidden');
				_self.iframe[0].scroll = 'no';
				_self.iframe.css('overflow','hidden');
				var height = _self.textarea.outerHeight();
				var span,timer,lastHeight = 0;
				var autoHeight = function() {
					clearTimeout(timer);
					timer = setTimeout(function() {
						if(!span) {
							span = _self.editorDoc.createElement('span');
		                    span.style.cssText = 'display:block;width:0;margin:0;padding:0;border:0;clear:both;';
		                    span.innerHTML = '.';
						}
						var tempSpan = span.cloneNode(true);
						_self.editorDoc.body.appendChild(tempSpan);
						var currentHeight = tempSpan.offsetTop;
						if(currentHeight > height) {
							_self.body.css('height',currentHeight);
							_self.codeContainer.height(currentHeight);
						}else {
							_self.body.css('height',height);
							_self.codeContainer.height(height);
						}
						_self.editorDoc.body.removeChild(tempSpan);
					},50);
				}
				body.bind("contentchange keyup mouseup paste input activate focus", function(e) {
					autoHeight();
				});
				$(_self).on('ready afterModeChange',function(e) {
					if(_self.viewMode === 'default') {
						autoHeight();
					}
				});
			}
		},

		/**
		* ��ʼ����ݼ�
		*/
		initHotkey:function() {
			var _self = this;
			$( _self.editorDoc ).on('keydown',function(e) {
				//Ctrl+Zִ��undo����
				if ( (e.metaKey || e.ctrlKey) && e.keyCode === 90) {
					e.preventDefault();
					_self.triggerControl('undo');
				}
				//Ctrl+Yִ��redo����
				if (e.ctrlKey && e.keyCode == 89) {
					e.preventDefault();
					_self.triggerControl('redo');
				}
				//���س�������һ��p
				if (e.keyCode === 13) {
					var blockquote = _self.getRangeNode('blockquote');
					if(blockquote && blockquote.length) {
						_self.execCommand('formatblock',false,'<br>');
					}/*else {
						_self.execCommand('formatblock',false,'<p>');
					}*/
					//����dz
					//_self.execCommand('formatblock',false,'<br>');
				}

				//��shift+�س�������һ��<br/>
				if ( e.shiftKey  && e.keyCode === 13) {
					_self.execCommand('formatblock',false,'<br>');
				}
				//��Ctrl+�س��ύ�༭������
				if (e.keyCode === 13 && e.ctrlKey) {
					e.preventDefault();
					_self.textarea.closest('form').submit();
				}
			});
			//��ESC�ر�
	        $(document.body).on('keydown',function(e) {
	            if(e.keyCode === 27) {
	                _self.hideDialog();
	            }
	        });
		},

		/**
		* ��鵱ǰ������ڵ�Ԫ�أ��Ƿ��ж����toolbar��״̬
		*/
		updateToolbar:function(element) {
			var _self = this;
			//undo redo��ť״̬�ĸ���
			if(_self.undoIndex > 1) {
				_self.setEnabled('undo');
			}else {
				_self.setDisabled('undo');
			}
			if(_self.undoIndex < _self.undoStack.length) {
				_self.setEnabled('redo');
			}else {
				_self.setDisabled('redo');
			}
			var element = this.getRangeNode();
			element = element && element[0];//תΪdom����
			if(!element || !element.nodeType) { return this; }
			var controls = _self.controls;
			for(var name in controls) {
				var control = controls[name],
					tags = control.tags,
					css = control.css,
					controlElem = control.element,
					isActive = false,
					command = controls[name].command;
				if(!controlElem || !command) { continue; }
				(function() {
					/*if(_self.queryCommandValue(command)) {
						isActive = true;
						return;
					}*/
					if(_self.queryCommandState(command)) {
						isActive = true;
						return;
					}
					if(tags) {
						if( $.inArray(element.tagName.toLowerCase(),tags) >= 0) {
							isActive = true;
							return;
						} else {
							//�����Ƿ񱻷��ϵı�ǩ������
							for(var i = 0;i < tags.length;i++) {
								if($(element).closest(tags[i]).length) {
									isActive = true;
									return;
								}
							}
						}
					}
					if(css) {
						for(var style in css) {
							var val = $(element).css(style).toString();//ie6�£�fontWeightȡ����Ϊ����
							if(val && val.toString().toLowerCase() === css[style]) {
								isActive = true;
								return;
							}
						}
					}
				})();
				if(isActive) {
					controlElem.addClass('activate');
				}else {
					controlElem.removeClass('activate');
				}
			}

			//TODO:����������С�ļ���״̬
			var fontName = $(element).css('font-family');
			var mapSize = {
		    	'1':10,
		    	'2':12,
		    	'3':16,
		    	'4':18,
		    	'5':24,
		    	'6':32,
		    	'7':48
	    	}
			var fontSize = parseInt($(element).css('font-size'),10);
			if(fontSize === 13){
				fontSize = 14;
			}
			if(mapSize[fontSize]) {
				fontSize = mapSize[fontSize];//ieȡfont-size������ 1��2��3����
			}
			controls['fontName'].element.find('.wind_select span').text(fontName);
			controls['fontSize'].element.find('.wind_select span').text(fontSize);
		},

		/**
		* ��ԭѡ��
		*/
		restoreRange:function(range) {
			var _self = this, sel;
			if (range !== null) {
				var win = _self.iframe.get(0).contentWindow;
				if (win.getSelection) { //non IE and there is already a selection
					sel = win.getSelection();
					if (sel.rangeCount > 0) {
						sel.removeAllRanges();
					}
					try {
						sel.addRange(range);
					} catch (e) {
						$.error(e);
					}
				} else if (_self.editorDoc.createRange) { // non IE and no selection
					win.getSelection().addRange(range);
				} else if (_self.editorDoc.selection) { //IE
					range.select();
				}
			}
		},

		/**
		 * ȡ�õ�ǰ��괦���ڵķ��ı�DOM�ڵ�
		 */
		getRangeNode:function(filterTagName) {
			var _self = this,
				range = _self.getRange();
			if(!range) {
				//return;
				//������α�����ע�͵ģ���������ڱ༭������δ�۽���ʱ������ᵼ�±���������Ҫ�ֶ��۽��������������
				this.setFocus($(this.editorDoc.body));
				range = _self.getRange();
			}
			var node;
			//��IE�£������ҳû�л�ý��㣬Ҳ��ȡ��range�����Ե��ж�range��û��parentElement
			if(range && range.parentElement) {
				node = range.parentElement();
			}else if(range && range.commonAncestorContainer) {
				node = range.commonAncestorContainer;
			}else if(range && range.commonParentElement) {
				node = range.commonParentElement();
			}else {
				return;
			}
			//��ֹ�ı��ڵ�
			while(node.nodeType === 3) {
				node = node.parentNode;
			}
			if(!filterTagName) {
				return $(node);
			}else {
				if($(node).is(filterTagName)) {
					return $(node);
				}
				filterTagName = filterTagName.toLowerCase();
				return $(node).closest(filterTagName);
			}
		},


		/**
		* ִ��document.execCommand
		*/
		execCommand: function(a, b, c) {
			/*if (mozilla) {
				try {
					this.editorDoc.execCommand("styleWithCSS", false, true);
				} catch (e) {
					try {
						this.editorDoc.execCommand("useCSS", false, true);
					} catch (e2) {
					}
				}
			}*/
			//���༭��δ�۽�ʱ�Ĵ���
			/*var range = this.getRange();
			if(range === null || ie){
				this.setFocus($(this.editorDoc.body));
			}*/

            this.editorDoc.execCommand(a, b || false, c || null);
            var _self = this;
            setTimeout(function() {
				var lastChild = _self.editorDoc.body.lastChild;
				//����ǿ鼶Ԫ�أ���������һ��BR����ֹ�������������
				if( lastChild && ( isBlockTag(lastChild.tagName) || lastChild.nodeType == 3) ) {
					if(ie && $.browser.version < 8) {
						$(_self.editorDoc.body).append(' ');
					}else {
						$(_self.editorDoc.body).append('<br/>');
					}
				}
			},100);
            return this;
       	},

        /**
		* ����document.execCommandִ�к��ֵ
		*/
        queryCommandState: function(a) {
            if(a) {
            	var state;
            	try{
            		state = this.editorDoc.queryCommandState(a);//��������ǲ����ڵģ�firefox�ᱨ��
            	}catch(e) {
            	}
            	return state;
        	}
        },
		/**
		* ����document.execCommandִ�к��״̬
		*/
        queryCommandValue: function(a) {
            if(a) {
            	return this.editorDoc.queryCommandValue(a);
        	}
        },

		/**
		* ���ع�����
		*/
		initToolbar:function() {
			//console.time('initToolbar');
			var _self = this,
				toolbarConfig = _self.options.toolbar,
				toolbar = _self.toolbar,
				ul = $('<ul class="wind_editor_icons"/>');
				//����toolbar ��ť
				for(var i = 0; i < toolbarConfig.length; i++ ) {

					var controls = toolbarConfig[i].split(' '),
						li = $('<li class="wind_editor_small_icons"/>').appendTo(ul);

					for(var j = 0;j < controls.length; j++ ) {

						var controlName = controls[j];

						//������ǡ�|������֤������ͨ�ı༭����ť
						if(controlName !== '|') {
							var	control = _self.controls[controlName];

							if(!control) {
								continue;
							}
							//�Զ���HTMLʽ�˵���������ʽ������ѡ��
							if(control.element && control.element.length) {
								li.append(control.element);
							}else {
								//��ͨ��ťʽ�˵�
								var	menuButton = $('<div class="wind_icon"><span class="'+ controlName +'" title="'+ control.tooltip +'"></span></div>');
								//�Ѱ�ť��control�����
								control.element = menuButton;
								control.element.attr('data-control',controlName);
								li.append(menuButton);
							}

							//�Զ�����¼�
							control.bindEvent && control.bindEvent.call(_self,control);
						} else {
							//�����ǡ�|������ô��һ�����еı�ʶ
							li.append('<div class="wind_clear"></div>');
						}
					}
				}

			toolbar.append(ul);
			//���һ��wind_icon_bug�Ĵ��ڣ��Ա��Ų���Ĵ�icon
			_self.pluginsContainer = $('<li class="plugin_icons"></li>').appendTo(ul);
			//��ֹtoolbarѡ�У���֤�ı���ie�µĵ�ѡ��״̬
			setTimeout(function() {
				toolbar.find('.wind_icon span,.wind_icon em').attr('unselectable','on');
			},10);

			//���������ͼ�괥���༭������
			toolbar.on('click','.wind_icon',function(e) {
				e.preventDefault();
				var ele = $(this);
				if(ele.hasClass("J_toolbar_control_ignore")){
					return;
				}
				var control = _self.controls[$(this).data('control')];
				if(control) {
					_self.triggerControl(control);
				}
			});

			//�̶�������
			if(_self.options.fixedToolbar && !ie6) {
				_self.fixedToolbar();
			}
			var right_container = $('<div class="right_container"></div>').appendTo(toolbar);
			var triggerMode = $('<span class="wind_codeMode" unselectable="on">����</span>').appendTo(right_container);
			triggerMode.on('mousedown',function(e) {
				e.preventDefault();
				if(_self.viewMode === 'default') {
					_self.switchMode('html');
					_self.hideDialog();
					triggerMode[0].className = 'wind_onCodeMode';
					_self.textarea.focus();
				}else {
					_self.switchMode('default');
					triggerMode[0].className = 'wind_codeMode';
				}
			});

			//�л�toolbarģʽ��
			if(_self.options.toolbarSwitchable) {
				var switctButton = $('<span class="wind_toolbar_switch" data-type="advanced" unselectable="on">��</span>').insertBefore(toolbar.find('span.wind_codeMode'));//�򵥺�Ĭ���л���ť
				switctButton.on('mousedown',function(e) {
					e.preventDefault();
					_self.switchToolbar();
				});
			}

			//�ж�Ĭ���ǲ�����ʾminiģʽ
			if(_self.options.defaultToolbarMode === 'mini') {
				_self.switchToolbar();//�л���miniģʽ
			}
		},

		/*
		* �л��༭����������ģʽ���򵥺�Ĭ�ϵ��л���
		*/
		switchToolbar:function() {
			var _self = this,
				editorToolbar = _self.toolbar,
				miniToolbar = _self.options.mini.split(' '),
				codeButton = editorToolbar.find('span.wind_codeMode,span.wind_onCodeMode');
				swichButton = editorToolbar.find('span.wind_toolbar_switch');
			//��Ҫ���صİ�ť��������������´�����
			if(!_self.cacheSimpleControls) {
				_self.cacheSimpleControls = [];
				var controls = editorToolbar.find('div.wind_icon,div.wind_dropdown');
				controls.each(function() {
					var icon = this;
					var control = $(this).data('control');
					if($.inArray(control,miniToolbar) < 0) {
						_self.cacheSimpleControls.push($(icon));
					}
				});
				editorToolbar.find('div.wind_clear').each(function() {
					_self.cacheSimpleControls.push($(this));
				});
			}
			if(editorToolbar.data('mode') === 'default') {
				for(var i = 0;i < _self.cacheSimpleControls.length;i++) {
					_self.cacheSimpleControls[i].hide();
				}
				//_self.pluginsContainer.removeClass('wind_icon_big');
				swichButton.addClass('wind_toolbar_high').text('�߼�');
				codeButton.hide();
				editorToolbar.data('mode','mini');
			}else {
				for(var i = 0;i < _self.cacheSimpleControls.length;i++) {
					_self.cacheSimpleControls[i].show();
				}
				//_self.pluginsContainer.addClass('wind_icon_big');
				swichButton.removeClass('wind_toolbar_high').text('��');
				codeButton.css('display','block');
				editorToolbar.data('mode','default');
			}
		},
		/**
		* ���ù������ؼ�
		*/
		setDisabled:function() {
			var controls = this.controls;
			for(var i = 0;i < arguments.length;i++) {
				var control = controls[ arguments[i] ];
				if( control && control.element) {
					control.element.addClass('disabled');
				}
			}
		},

		/**
		* ���ù������ؼ�
		*/
		setEnabled:function() {
			if(this.viewMode !== 'default') {
				return;
			}
			var controls = this.controls;
			for(var i = 0;i < arguments.length;i++) {
				var control = controls[ arguments[i] ];
				if( control ) {
					control.element.removeClass('disabled');
				}
			}
		},

		/**
		* ���ع������ؼ�
		*/
		setHide:function() {
			var controls = this.controls;
			for(var i = 0;i < arguments.length;i++) {
				var control = controls[ arguments[i] ];
				if( control ) {
					control.element.hide();
				}
			}
		},

		/**
		* ���صײ�״̬��
		*/
    	fixedToolbar:function() {
    		var _self = this;
    		var toolbar = _self.toolbar,
    			toolbarWidth = toolbar.width();
    			//toolbarTop = toolbar.offset().top;
    		$(window).on('scroll resize',function() {
    			setTimeout(function() {
    				var toolbarTop = _self.container.offset().top;
    				var scrollTop = $(document).scrollTop();
    				if(scrollTop > toolbarTop){
    					toolbar.css({position:'fixed',top:'0',width:toolbarWidth,zIndex:2});
    				}else{
    					toolbar.css({position:'relative',top:'0'});
    				}
    			},16);
    		})
    	},

		/**
		* ���صײ�״̬��
		*/
		initStatusbar:function() {
			//alert('���صײ�״̬��');
			var _self = this,
				statusbar = _self.statusbar,
				checkWords = $('<span style="cursor:pointer;">�������</span>').appendTo(statusbar),
				offset = checkWords.offset();
				
				
			checkWords.on('click',function(e) {
				//����ubbת����Ĵ���
				_self.setValue(_self.getContent());
				var length = _self.codeContainer.val().length,//����ȷ�����ϱ�ǩ
					words_span = statusbar.find('span.J_words_length');
				if(!words_span.length) {
					words_span = $('<span class="J_words_length">��д'+ length +'��</span>').appendTo(statusbar);
				}
				words_span.css({
					position:'relative',
					left:-words_span.outerWidth(),
					top:-words_span.outerHeight(),
					background:'#fff',
					border:'1px solid #ccc',
					padding:'3px'
				}).html('��д'+ length +'��').show().delay(2000).fadeOut();
			});
		},

    	/**
    	* ����������
    	*/
    	enableToolbar:function() {
    		var _self = this;
    		_self.toolbar.find('.wind_select,.wind_icon').each(function() {
    			if($(this).data('control') !== 'undo' && $(this).data('control') !== 'redo') {
    				$(this).removeClass('disabled');
    			}
    		});
    		this.toolbar.removeClass('disabled');
    	},

    	/**
    	* ���ù�����
    	*/
    	disableToolbar:function() {
    		var _self = this;
    		_self.toolbar.find('.wind_select,.wind_icon').each(function() {
    			$(this).addClass('disabled');
    		});
    		this.toolbar.addClass('disabled');
    		this.setEnabled('html');
    	},

    	/**
		* �л�ģʽ
		*/
		switchMode:function(viewMode) {
			var _self = this;
			var currentMode = _self.viewMode;
			if(currentMode === viewMode) { return; }
			$(_self).trigger('beforeModeChange',[viewMode]);
			if(viewMode === 'default') {
				_self.setContent(this.codeContainer.val());
				_self.iframe.show();
				_self.codeContainer.hide();
				//this.focus();
				_self.enableToolbar();
				_self.viewMode = 'default';
				//�л����ɼ�������֮�󣬹�궨λ�������
				setTimeout(function() {
					//_self.setFocus( $(_self.editorDoc.body) );
				},10);
			} else if(viewMode === 'html') {
				this.setValue(this.getContent());
				this.iframe.hide();
				this.codeContainer.show();
				this.disableToolbar();
				this.viewMode = 'html';
			}
			$(this).trigger('afterModeChange',[viewMode]);
		},

		/**
		* ��ȡSelection����
		*/
		getSelection : function () {
			// firefox: document.getSelection is deprecated
			var win = this.iframe[0].contentWindow,
				doc = this.editorDoc;
			return doc.selection || win.getSelection();
		},

		/**
		* ��ȡѡ���е�range����
		*/
		getRange : function () {
			var selection = this.getSelection();
			if (!selection) {
				return null;
			}
			if (selection.rangeCount) { // w3c
				return selection.getRangeAt(0);
			} else if (selection.createRange) { // ie
				try{
					return selection.createRange();
				}catch(e){
					return null;
				}

			}
			return null;
		},

		/**
		* ��ȡѡ�е��ı�
		*/
		getRangeText : function () {
			var r = this.getRange();
			if(!r) {return null;}
			if(ie) {
				return r.text;
			}else {
				var d = $('<div/>');
				d.html(r.cloneContents())
				return d.text();
			}

			//return r;
		},
		/**
		* ��ȡѡ�е�HTML
		*/
		getRangeHTML: function() {
			if(ie) {
				$(this.editorDoc.body).focus();
			}
			
            var r = this.getRange();
            var s = this.getSelection();
			if(!r) {return null;}
			if(ie) {
				return r.htmlText;
			}else {
				var d = $('<div/>');
				d.html(r.cloneContents());
				return d.html();
			}
        },

		/**
		* ����ǿɼ�������ģʽ����ͬ���ɼ����������ݵ���������(textarea)
		*/
		saveContent:function() {
			var _self = this;
			if(this.viewMode === 'default') {
				var content = this.getContent();
				//content = content.replace(/<br\/?>$/, "");
				_self.setValue(content);
			}
			return this;
		},

		/**
		* ��ȡHTML
		*/
		getContent:function() {
			var _self = this;
			$(this).trigger('beforeGetContent');
			var content = _self.editorDoc.body.innerHTML;
			//��ΪbeforGetContent�¼����һЩҵ��תΪUBBģʽ����������ֵ����Ҫ��ת�ɿɼ������ã�Ҫ��Ȼ�ύʱ����ʲô�Ļ��ΪUBB
			$(this).trigger('afterSetContent');
			return content;
		},
		/**
		 * ��ȡ�ı�
		 */
		getContentTxt: function(){
			var fillChar = ie6 ? '\ufeff' : '\u200B';
			var reg = new RegExp( fillChar,'g' );
            //ȡ�����Ŀո����c2a0�������룬�����������\u00a0
            return this.editorDoc.body[ie ? 'innerText':'textContent'].replace(reg,'').replace(/\u00a0/g,' ');
		},
		/**
		* ճ������ for not ie
		*/
		pasteCache:function(e) {
			//e.preventDefault();
			var editorDoc = this.editorDoc,
				enableKeyDown = false,
				_self = this;
			var oriHTML = editorDoc.body.innerHTML;
			//����body���������ȫ��ɾ������Ҫ������������,��Ȼû��ճ��
			if(oriHTML.replace(/\s*/, '') === '') {
				editorDoc.body.innerHTML = ''+ ( webkit ? '<br/>' : '' ) +'';
			}
			//create the temporary html editor
			var preTemp = editorDoc.createElement("div");
			preTemp.className = 'windeditor_temp';
			preTemp.innerHTML = '\uFEFF';
			preTemp.style.left = "-10000px";    //hide the div
			preTemp.style.height = "1px";
			preTemp.style.width = "1px";
			preTemp.style.position = "absolute";
			preTemp.style.overflow = "hidden";
			editorDoc.body.appendChild(preTemp);
			//disable keyup,keypress, mousedown and keydown
            $(editorDoc.body).bind('mousedown.paste', function(e) {e.preventDefault();});
            $(editorDoc.body).bind('keydown.paste', function(e) {e.preventDefault();});
            enableKeyDown = false;
            //get current selection;
            var range = _self.getSelection().getRangeAt(0),//��ס֮ǰ�Ĺ��λ��

				//�ѹ���ƶ��²�������ʱdiv
				docBody = preTemp.firstChild,
				rng = editorDoc.createRange();
			/*rng.setStart(docBody, 0);
			rng.setEnd(docBody, 1);
			var sel = _self.getSelection();
			sel.removeAllRanges();
			sel.addRange(rng);*/

            var originText = editorDoc.textContent;
            if (originText === '\uFEFF'){
            	originText = "";
            }

            setTimeout(function() {
				var newData = '';
            	//get and filter the data after onpaste is done
				if (preTemp.innerHTML === '\uFEFF') {//webkit����
					newData = "";
					//ĳЩ����»���ֶ��ͬ����ID����
					$(editorDoc.body).find('.windeditor_temp').remove();
					return;
				}
				newData = preTemp.innerHTML;
				if (range) {
					var sel = _self.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				}
				//����word
				newData = _self.cleanWordHTML(newData);
				preTemp.innerHTML = newData;
				//paste the new data to the editor

				_self.insertHTML( newData );
				$(editorDoc.body).find('.windeditor_temp').remove();
			}, 0);
            //enable keydown,keyup,keypress, mousedown;
            enableKeyDown = true;
            $(editorDoc.body).unbind('.paste');
			return this;
		},

		/**
		* ճ������ for ie
		*/
		pasteCache4IE:function(e) {
			e.preventDefault();
			var _self = this;
			var ifmTemp = document.getElementById("ifmTemp");
			if (!ifmTemp) {
				ifmTemp = document.createElement("IFRAME");
				ifmTemp.id = "ifmTemp";
				ifmTemp.style.width = "1px";
				ifmTemp.style.height = "1px";
				ifmTemp.style.position = "absolute";
				ifmTemp.style.border = "none";
				ifmTemp.style.left = "-10000px";
				//ifmTemp.src="iframeblankpage.html";
				document.body.appendChild(ifmTemp);
				ifmTemp.contentWindow.document.designMode = "On";
				ifmTemp.contentWindow.document.open();
				ifmTemp.contentWindow.document.write("<body></body>");
				ifmTemp.contentWindow.document.close();
			}else {
				ifmTemp.contentWindow.document.body.innerHTML = "";
			}
			ifmTemp.contentWindow.focus();
			ifmTemp.contentWindow.document.execCommand("Paste",false,null);

			var newData = ifmTemp.contentWindow.document.body.innerHTML;
			//filter the pasted data
			newData = _self.cleanWordHTML(newData);
			ifmTemp.contentWindow.document.body.innerHTML = newData;
			_self.insertHTML(newData);
		},

		/**
		* ����HTML
		*/
		setContent:function(html) {
			html = this.formatXHTML(html);
			try {
				$(this).trigger('beforeSetContent',[html]);
			}catch(e) {
				//�Զ����¼��е��¼��п��ܳ�����JSִֹͣ��
			}

			//chorme��<input onfocus="alert(1)" autofocus="" />����alert������bbcode���setContenting�����д��html
			//this.editorDoc.body.innerHTML = html;

			this.codeContainer.val(html);//��������ʱӦ����textarea���ֵҲ����
			//������һ��after֮ǰ���¼�����Ϊ�п��ܱ�ubbӰ�죬ubbת��Ҫ�������κ��¼�֮ǰ��Ҳ����˵����¼���רΪUBB���ǵ�
			//!TODO �д��Ż��ع�
			$(this).trigger('setContenting',[html]);
			//afterSetContent���������Զ����һЩUBB�ͱ�ǩת��
			$(this).trigger('afterSetContent',[html]);
			return this;
		},

		/**
		* ��ȡ����ģʽ�µ���ʾֵ���п�����textarea���п��ܲ���
		*/
    	getValue:function() {
    		$(this).trigger('beforeGetValue');
    		this.saveContent();
    		return this.codeContainer.val();//Ĭ��ȡ���ص�textareaֵ
    	},

    	/**
		* ���ô���ģʽ�µ���ʾֵ���п�����textarea���п��ܲ���
		*/
    	setValue:function( val ) {
    		$(this).trigger('beforeSetValue',[val]);
    		val = this.formatXHTML(val);
    		this.codeContainer.val( val );//Ĭ���������ص�textareaֵ
    		$(this).trigger('afterSetValue',[val]);
    	},

		/**
		* ����html
		*/
		filterHTML:function(html) {
			var filterTag = this.options.filterTag;
		},

		/**
		* ����HTML
		*/
		insertHTML:function(html) {
			var _self = this;
			_self.focus();
			if(ie) {
				var range = _self.editorDoc.selection.createRange();
				range.pasteHTML(html);
			}else {
				var selection = this.getSelection();
				var range;
				if (selection) {
					range = selection.getRangeAt(0);
				}else {
					range = _self.editorDoc.createRange();
				}
				if(range && range.insertNode) {
					range.deleteContents();
				}
				var oFragment = range.createContextualFragment(html),
				oLastNode = oFragment.lastChild ;
				range.insertNode(oFragment) ;
				range.setEndAfter(oLastNode ) ;
				range.setStartAfter(oLastNode );
				selection.removeAllRanges();//���ѡ��
				selection.addRange(range);
				_self.addToUndoStack();
			}
			setTimeout(function(){
				var lastChild = _self.editorDoc.body.lastChild;
				//����ǿ鼶Ԫ�أ���������һ��BR����ֹ�������������
				if( lastChild && ( isBlockTag(lastChild.tagName) || lastChild.nodeType == 3) ) {
					if(ie && $.browser.version < 8) {
						$(_self.editorDoc.body).append(' ');
					}else {
						$(_self.editorDoc.body).append('<br/>');
					}
				}
			});
			return _self;
		},

		/**
		* �ѹ�����õ�ĳ��node���
		*/
		setFocus:function(node) {
			var range,
				nativeNode = node[0].lastChild || node[0];
			var textNode = this.editorDoc.createElement("span");
			$(textNode).insertBefore(nativeNode);
			if(ie) {
				// node.focus();
				// nativeNode.setAttribute('tabindex','-1');
				// nativeNode.focus();
				//nativeNode.focus();
				var range = this.editorDoc.body.createTextRange();
				range.moveToElementText(textNode);
				range.moveStart("character");
				range.select();
			}else {
				var range = this.editorDoc.createRange();
				range.setStart(textNode, 0);
				range.setEnd(textNode,0);
				range.collapse(true);
				var sel = this.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			}
			$(textNode).remove();
		},

		/**
		* ѡ��һ���ڵ�
		*/
		selectNode:function(node) {
			var nativeNode = node[0];
			if(ie) {
				var range = this.editorDoc.body.createTextRange();
				range.moveToElementText(nativeNode);
				range.moveStart("character");
				range.select();
			}else {
				var range = this.editorDoc.createRange();
				range.selectNodeContents(nativeNode);
				range.deleteContents ();
				range.selectNode(nativeNode);
				var sel = this.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			}
		},

		/**
		* �����Ƿ�Ϊ��
		*/
		is_empty:function() {
			var html = $(this.editorDoc.body).html();
			var emptyContentRegex = /^<([\w]+)[^>]*>(<br\/?>)?<\/\1>$/;
			if (emptyContentRegex.test(html)) {
				return true;
			}
			return false;
		},

		/**
		* ������ش洢����
		*/
		clear_local_data:function() {
			this.localStorage.remove('windeditor');
			return this;
		},

		/**
		* ��ý���
		*/
		focus:function() {
			//�ɼ��������²ſ���focus������ie6�»ᱨ
			if( this.viewMode == 'default' ) {
				if(ie) {
					this.iframe[0].contentWindow.focus();
				} else {
					this.editorDoc.body.focus();
				}
			}
			return this;
		},

		/**
		* �������ߣ�ȡ��ͼƬ���
		*/
		getImgSize: function(src,callback) {
			var img = new Image();
			img.src = src;
			if(img.complete) {
				callback.call(this,img.width,img.height);
			}else {
				img.onload = function() {
					callback.call(this,img.width,img.height);
				}
			}
		},

		/**
		* ��ӵ���ʷ��¼
		*/
		addToUndoStack:function() {
			var _self = this,
				undoLength = _self.options.undoLength,
				undoStack = _self.undoStack,
				undoIndex = _self.undoIndex;
			if( undoStack.length >= undoLength) {
				_self.undoStack.shift();
			}
			var stack = {
				html: _self.editorDoc.body.innerHTML,
				range: _self.getRange()
			};
			var prevHtml = undoIndex > 0 ? (undoStack[undoIndex-1] ? undoStack[undoIndex-1].html : '') : '';
			if(stack.html !== prevHtml) {
				_self.undoStack.push(stack);
				_self.undoIndex ++;
			}
		},

		/**
		* ����Toolbar�еİ�ť
		*/
		triggerControl:function(control) {
			var _self = this;
			if(typeof control === 'string') {
				control = _self.controls[control];
			}

			if(!control || control.element.hasClass('disabled')) {
				return;
			}

			//���������exec��������ôִ���Զ������
			//_self.hideDialog();
			if (control.exec) {
				control.exec.call(_self,control);
			} else {
				//ִ��������Դ�����
				_self.execCommand(control.command);
			}
			//��undo,redo�⣬�������ʱ��Ҫ������ʷ��¼
			if(control !== _self.controls['undo'] && control !== _self.controls['redo']) {
				_self.addToUndoStack();
			}
			setTimeout(function() {
				_self.updateToolbar();
			},16);

			setTimeout(function(){
				var lastChild = _self.editorDoc.body.lastChild;
				//����ǿ鼶Ԫ�أ���������һ��BR����ֹ�������������
				if( lastChild && ( isBlockTag(lastChild.tagName) || lastChild.nodeType == 3) ) {
					if(ie && $.browser.version < 8) {
						$(_self.editorDoc.body).append(' ');
					}else {
						$(_self.editorDoc.body).append('<br/>');
					}
				}
			},100);
		},

		/**
		* ���ز��
		*/
		loadPlugins:function(callback) {
			var _self = this,
				plugins = _self.options.plugins,
				j = 0;
			if(!plugins.length) {
				$(_self).trigger('ready');
				callback && callback();
				return;
			}
			var args = [];
			for(var i = 0,len = plugins.length; i < len; i++) {
				var	pluginCatalog = _self.options.editor_path + 'plugins/' + plugins[i];
				args.push(pluginCatalog + '/plugin.js?v=' + GV.JS_VERSION);
			}
			args.push(function() {
				setTimeout(function() {
					$(_self).trigger('ready');
					callback && callback();
				},0);
			});
			//Ŀǰ��ʱ����Wind.js
			//TODO:�ڱ༭���ڲ�����һ���ļ����ض��У�����Wind.js
			Wind.js.apply(null,args);
		},

		/**
		 * localStorage ���ش洢
		 */
		localStorage : (function() {
			var localStorageName = 'localStorage',
				storage;
			function serialize(value) {
				//TODO:�洢���л������
				return value;
		    }

		    function deserialize(value) {
		        return value;
		    }

			if (localStorageName in window) {//chrome firefox opera
				storage = window[localStorageName];
		        return {
					set :function(key, val) {
						storage.setItem(key, serialize(val));
					},
					get : function(key) {
						return deserialize(storage.getItem(key));
					},
			        remove : function(key) {
			            storage.removeItem(key);
			        },
			        clear : function() {
			            storage.clear();
			        }
		        };
		    }else if(document.documentElement.addBehavior) {//ie
				var UserData = {
			        userData : null,
			        name : location.hostname,
			        init:function(){
			            if (!UserData.userData) {
			                try {
			                    UserData.userData = document.createElement('INPUT');
			                    UserData.userData.type = "hidden";
			                    UserData.userData.style.display = "none";
			                    UserData.userData.addBehavior ("#default#userData");
			                    document.body.appendChild(UserData.userData);
			                    var expires = new Date();
			                    expires.setDate(expires.getDate()+365);
			                    UserData.userData.expires = expires.toUTCString();
			                } catch(e) {
			                    return false;
			                }
			            }
			            return true;
			        },
			        set : function(key, value) {
			            if(UserData.init()){
			            	try{
			            		UserData.userData.load(UserData.name);
				                UserData.userData.setAttribute(key, value);
				                UserData.userData.save(UserData.name);
			            	}catch(e){}
			            }
			        },
			        get : function(key) {
			            if(UserData.init()){
			            	var value;
			            	try{
			            		UserData.userData.load(UserData.name);
			            		value = UserData.userData.getAttribute(key);
			            	}catch(e){
			            		value = "";
			            	}
				            return value;
			            }
			        },
			        remove : function(key) {
			            if(UserData.init()){
			            	try{
			            		UserData.userData.load(UserData.name);
					            UserData.userData.removeAttribute(key);
					            UserData.userData.save(UserData.name);
			            	}catch(e){}
			            }
			        },
			        clear: function(){
			        	if(UserData.init()){
			        		try{
			        			UserData.userData.load(UserData.name)
				        		var attributes = UserData.userData.XMLDocument.documentElement.attributes;
				        		for (var i = 0, attr; attr = attributes[i]; i++) {
									UserData.userData.removeAttribute(attr.name);
								}
								UserData.userData.save(UserData.name);
			        		}catch(e){}
			            }
			        }
			    };
			    return UserData;
			}
		})(),

		/**
		* ��ק����
		*/
		dragdorp:function(element,handle) {
			if(!element.length) {
				return;
			}
			var elemHeight = element.outerHeight(),elemWidth = element.outerWidth();
			var winWidth,
				winHeight,
				docScrollTop = 0,
				docScrollLeft = 0,
				POS_X = 0,
				POS_Y = 0;
			//��ǰ�����ڲ���������
		    function capture(elem) {
		        elem.setCapture ? elem.setCapture() : window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
		    }
		    function release(elem) {
		        elem.releaseCapture ? elem.releaseCapture() : window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
		    }
		    function getMousePosition(e) {
				var posx = 0,
					posy = 0,
					db = document.body,
					dd = document.documentElement,
					e = e || window.event;

				if (e.pageX || e.pageY) {
					posx = e.pageX;
					posy = e.pageY;
				}
				else if (e.clientX || e.clientY) {
					posx = e.clientX + db.scrollLeft + dd.scrollLeft;
					posy = e.clientY + db.scrollTop  + dd.scrollTop;
				}

				return { 'x': posx, 'y': posy };
			}
			handle = handle || element.find('.edit_menu_top');
			handle.css({cursor:'move'});
	    	var el = handle[0].setCapture ? handle : $(document);
	    	//����갴���¼�
	        handle.on('mousedown',function(e) {
	        	e.preventDefault();
	        	capture(this);
	        	if(handle.setCapture) {
			        //������겶��
			        handle.setCapture();
			    }else{
			        //��ֹĬ�϶���
			        e.preventDefault();
			    };
			    //��ȡ���ڳߴ�͹�����״̬
			    winWidth = $(window).width();
			    winHeight = $(window).height();
			    docScrollTop = $(document).scrollTop();
			    docScrollLeft = $(document).scrollLeft();

			    //��ȡ���ĳ�ʼƫ��ֵ
			    var offset = element.offset();
			    var mousePostion = getMousePosition(e);
			    //��¼�����Դ��ڵ�λ��ƫ��
			    POS_X = mousePostion.x - offset.left;
		    	POS_Y = mousePostion.y - offset.top;

			    //������ƶ��¼�
			    el.on('mousemove',function(e) {
			    	e.preventDefault();
			    	//��ֹѡ���ı�
			    	window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			    	//��ȡ���λ�á�����Ŀ��λ�ú��ƶ���Χ
		    		var mousePostion = getMousePosition(e),
		            	mouseY = mousePostion.y,
		            	mouseX = mousePostion.x,
			            currentLeft = mouseX - POS_X,
			            currentTop = mouseY - POS_Y,
			            maxLeft = winWidth - elemWidth + docScrollLeft,
			            maxTop = winHeight - elemHeight + docScrollTop;
			        //���Ƶ������ƶ���Χ��Ĭ�ϲ�������������
			        if(currentLeft < docScrollLeft){
			        	currentLeft = docScrollLeft;
			        }
			        if(currentTop < docScrollTop){
			        	currentTop = docScrollTop;
			        }
			        if(currentLeft > maxLeft){
			        	currentLeft = maxLeft;
			        }
			        if(currentTop > maxTop){
			        	currentTop = maxTop;
			        }
			        //���ô���λ��
			        element.css({ left : currentLeft + "px", top : currentTop + "px" });
	       		}).on('mouseup',function (e) {
	       			//�ͷ���겶��ȡ���¼���
		            release(this);
		            $(el).unbind('mousemove').unbind('mouseup');
				});
	        });
		},

		/**
		* ��ʽ��XHTML
		*/
		formatXHTML:function(html, htmlTags, urlType, wellFormatted, indentChar) {
			//thanks kindEditor
			//@url http://www.kindsoft.net/
			if(!html) { return ''; }


			function _getAttrList(tag) {
				var list = {},
					reg = /\s+(?:([\w\-:]+)|(?:([\w\-:]+)=([^\s"'<>]+))|(?:([\w\-:"]+)="([^"]*)")|(?:([\w\-:"]+)='([^']*)'))(?=(?:\s|\/|>)+)/g,
					match;
				while ((match = reg.exec(tag))) {
					var key = (match[1] || match[2] || match[4] || match[6]).toLowerCase(),
						val = (match[2] ? match[3] : (match[4] ? match[5] : match[7])) || '';
					list[key] = val;
				}
				return list;
			}
			function _toMap(str) {
				var obj = {}, items = str.split(",");
				for ( var i = 0; i < items.length; i++ )obj[ items[i] ] = true;
				return obj;
			}
			function _getCssList(css) {
				var list = {},
					reg = /\s*([\w\-]+)\s*:([^;]*)(;|$)/g,
					match;
				while ((match = reg.exec(css))) {
					var key = $.trim(match[1].toLowerCase()),
						val = $.trim(match[2]);
					list[key] = val;
				}
				return list;
			}
			var _INLINE_TAG_MAP = _toMap('a,abbr,acronym,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,img,input,ins,kbd,label,map,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'),
				_BLOCK_TAG_MAP = _toMap('address,applet,blockquote,body,center,dd,dir,div,dl,dt,fieldset,form,frameset,h1,h2,h3,h4,h5,h6,head,hr,html,iframe,ins,isindex,li,map,menu,meta,noframes,noscript,object,ol,p,pre,script,style,table,tbody,td,tfoot,th,thead,title,tr,ul'),
				_SINGLE_TAG_MAP = _toMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed'),
				_STYLE_TAG_MAP = _toMap('b,basefont,big,del,em,font,i,s,small,span,strike,strong,sub,sup,u'),
				_CONTROL_TAG_MAP = _toMap('img,table,input,textarea,button'),
				_PRE_TAG_MAP = _toMap('pre,style,script'),
				_NOSPLIT_TAG_MAP = _toMap('html,head,body,td,tr,table,ol,ul,li'),
				_AUTOCLOSE_TAG_MAP = _toMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'),
				_FILL_ATTR_MAP = _toMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected'),
				_VALUE_TAG_MAP = _toMap('input,button,textarea,select');

			urlType = urlType || '';
			wellFormatted = wellFormatted || false;
			indentChar = indentChar || '\t';
			var fontSizeList = 'xx-small,x-small,small,medium,large,x-large,xx-large'.split(',');
			html = html.replace(/(<(?:pre|pre\s[^>]*)>)([\s\S]*?)(<\/pre>)/ig, function($0, $1, $2, $3) {
				return $1 + $2.replace(/<(?:br|br\s[^>]*)>/ig, '\r\n') + $3;
			});
			html = html.replace(/<(?:br|br\s[^>]*)\s*\/?>\s*<\/p>/ig, '</p>');
			html = html.replace(/(<(?:p|p\s[^>]*)>)\s*(<\/p>)/ig, '$1<br />$2');
			html = html.replace(/\u200B/g, '');
			var htmlTagMap = {};
			if (htmlTags) {
				$.each(htmlTags, function(key, val) {
					var arr = key.split(',');
					for (var i = 0, len = arr.length; i < len; i++) {
						htmlTagMap[arr[i]] = _toMap(val);
					}
				});
				if (!htmlTagMap.script) {
					html = html.replace(/(<(?:script|script\s[^>]*)>)([\s\S]*?)(<\/script>)/ig, '');
				}
				if (!htmlTagMap.style) {
					html = html.replace(/(<(?:style|style\s[^>]*)>)([\s\S]*?)(<\/style>)/ig, '');
				}
			}
			var re = /(\s*)<(\/)?([\w\-:]+)((?:\s+|(?:\s+[\w\-:]+)|(?:\s+[\w\-:]+=[^\s"'<>]+)|(?:\s+[\w\-:"]+="[^"]*")|(?:\s+[\w\-:"]+='[^']*'))*)(\/)?>(\s*)/g;
			var tagStack = [];
			html = html.replace(re, function($0, $1, $2, $3, $4, $5, $6) {
				var full = $0,
					startNewline = $1 || '',
					startSlash = $2 || '',
					tagName = $3.toLowerCase(),
					attr = $4 || '',
					endSlash = $5 ? ' ' + $5 : '',
					endNewline = $6 || '';
				if (htmlTags && !htmlTagMap[tagName]) {
					return '';
				}
				if (endSlash === '' && _SINGLE_TAG_MAP[tagName]) {
					endSlash = ' /';
				}
				if (_INLINE_TAG_MAP[tagName]) {
					if (startNewline) {
						startNewline = ' ';
					}
					if (endNewline) {
						endNewline = ' ';
					}
				}
				if (_PRE_TAG_MAP[tagName]) {
					if (startSlash) {
						endNewline = '\n';
					} else {
						startNewline = '\n';
					}
				}
				if (wellFormatted && tagName == 'br') {
					endNewline = '\n';
				}
				if (_BLOCK_TAG_MAP[tagName] && !_PRE_TAG_MAP[tagName]) {
					if (wellFormatted) {
						if (startSlash && tagStack.length > 0 && tagStack[tagStack.length - 1] === tagName) {
							tagStack.pop();
						} else {
							tagStack.push(tagName);
						}
						startNewline = '\n';
						endNewline = '\n';
						for (var i = 0, len = startSlash ? tagStack.length : tagStack.length - 1; i < len; i++) {
							startNewline += indentChar;
							if (!startSlash) {
								endNewline += indentChar;
							}
						}
						if (endSlash) {
							tagStack.pop();
						} else if (!startSlash) {
							endNewline += indentChar;
						}
					} else {
						startNewline = endNewline = '';
					}
				}
				if (attr !== '') {
					var attrMap = _getAttrList(full);
					if (tagName === 'font') {
						var fontStyleMap = {}, fontStyle = '';
						$.each(attrMap, function(key, val) {
							if (key === 'color') {
								fontStyleMap.color = val;
								delete attrMap[key];
							}
							if (key === 'size') {
								fontStyleMap['font-size'] = fontSizeList[parseInt(val, 10) - 1] || '';
								delete attrMap[key];
							}
							if (key === 'face') {
								fontStyleMap['font-family'] = val;
								delete attrMap[key];
							}
							if (key === 'style') {
								fontStyle = val;
							}
						});
						if (fontStyle && !/;$/.test(fontStyle)) {
							fontStyle += ';';
						}
						$.each(fontStyleMap, function(key, val) {
							if (val === '') {
								return;
							}
							if (/\s/.test(val)) {
								val = "'" + val + "'";
							}
							fontStyle += key + ':' + val + ';';
						});
						attrMap.style = fontStyle;
					}
					$.each(attrMap, function(key, val) {
						if (_FILL_ATTR_MAP[key]) {
							attrMap[key] = key;
						}
						if ($.inArray(key, ['src', 'href']) >= 0) {
							//attrMap[key] = _formatUrl(val, urlType);
						}
						if (htmlTags && key !== 'style' && !htmlTagMap[tagName]['*'] && !htmlTagMap[tagName][key] ||
							tagName === 'body' && key === 'contenteditable' ||
							/^kindeditor_\d+$/.test(key)) {
							delete attrMap[key];
						}
						if (key === 'style' && val !== '') {
							var styleMap = _getCssList(val);
							$.each(styleMap, function(k, v) {
								if (htmlTags && !htmlTagMap[tagName].style && !htmlTagMap[tagName]['.' + k]) {
									delete styleMap[k];
								}
							});
							var style = '';
							$.each(styleMap, function(k, v) {
								style += k + ':' + v + ';';
							});
							attrMap.style = style;
						}
					});
					attr = '';
					$.each(attrMap, function(key, val) {
						if (key === 'style' && val === '') {
							return;
						}
						val = val.replace(/"/g, '&quot;');
						attr += ' ' + key + '="' + val + '"';
					});
				}
				if (tagName === 'font') {
					tagName = 'span';
				}
				return startNewline + '<' + startSlash + tagName + attr + endSlash + '>' + endNewline;
			});
			//html = html.replace(/\n\s*\n/g, '\n');
			return html;
		},

		/**
		* word����
		*/
		cleanWordHTML:function(html) {
			//thanks ueditor
			//@url http://ueditor.baidu.com/
			function isWordDocument( strValue ) {
	            var re = new RegExp( /(class="?Mso|style="[^"]*\bmso\-|w:WordDocument|<v:)/ig );
	            return re.test( strValue );
	        }

	        function ensureUnits( v ) {
	            v = v.replace( /([\d.]+)([\w]+)?/g, function ( m, p1, p2 ) {
	                return (Math.round( parseFloat( p1 ) ) || 1) + (p2 || 'px');
	            } );
	            return v;
	        }
			function ptToPx(value){
		        return /pt/.test(value) ? value.replace( /([\d.]+)pt/g, function( str ) {
		            return  Math.round(parseFloat(str) * 96 / 72) + "px";
		        } ) : value;
		    }

	        function filterPasteWord( str ) {
	            str = str.replace( /<!--\s*EndFragment\s*-->[\s\S]*$/, '' )
	                //remove link break
	                .replace( /^(\r\n|\n|\r)|(\r\n|\n|\r)$/ig, "" )
	                //remove &nbsp; entities at the start of contents
	                .replace( /^\s*(&nbsp;)+/ig, "" )
	                //remove &nbsp; entities at the end of contents
	                .replace( /(&nbsp;|<br[^>]*>)+\s*$/ig, "" )
	                // Word comments like conditional comments etc
	                .replace( /<!--[\s\S]*?-->/ig, "" )
	                //ת��ͼƬ
	                .replace(/<v:shape [^>]*>[\s\S]*?.<\/v:shape>/gi,function(str){
	                    var width = str.match(/width:([ \d.]*p[tx])/i)[1],
	                        height = str.match(/height:([ \d.]*p[tx])/i)[1],
	                        src =  str.match(/src=\s*"([^"]*)"/i)[1];
	                    return '<img width="'+ptToPx(width)+'" height="'+ptToPx(height)+'" src="' + src + '" />'
	                })
	                //ȥ�����������
	                .replace( /v:\w+=["']?[^'"]+["']?/g, '' )
	                // Remove comments, scripts (e.g., msoShowComment), XML tag, VML content, MS Office namespaced tags, and a few other tags
	                .replace( /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|xml|meta|link|style|\w+:\w+)(?=[\s\/>]))[^>]*>/gi, "" )
	                //convert word headers to strong
	                .replace( /<p [^>]*class="?MsoHeading"?[^>]*>(.*?)<\/p>/gi, "<p><strong>$1</strong></p>" )
	                //remove lang attribute
	                .replace( /(lang)\s*=\s*([\'\"]?)[\w-]+\2/ig, "" )
	                //��������font����ƥ��&nbsp;�п����ǿո�
	                .replace( /<font[^>]*>\s*<\/font>/gi, '' )
	                //��������class
	                .replace( /class\s*=\s*["']?(?:(?:MsoTableGrid)|(?:MsoNormal(Table)?))\s*["']?/gi, '' );

	            // Examine all styles: delete junk, transform some, and keep the rest
	            //�޸���ԭ�е�����, ����style='fontsize:"����"'ԭ����ƥ��ʧЧ��
	            str = str.replace( /(<[a-z][^>]*)\sstyle=(["'])([^\2]*?)\2/gi, function( str, tag, tmp, style ) {

	                var n = [],
	                        i = 0,
	                        s = style.replace( /^\s+|\s+$/, '' ).replace( /&quot;/gi, "'" ).split( /;\s*/g );

	                // Examine each style definition within the tag's style attribute
	                for ( var i = 0; i < s.length; i++ ) {
	                    var v = s[i];
	                    var name, value,
	                        parts = v.split( ":" );

	                    if ( parts.length == 2 ) {
	                        name = parts[0].toLowerCase();
	                        value = parts[1].toLowerCase();
	                        // Translate certain MS Office styles into their CSS equivalents
	                        switch ( name ) {
	                            case "mso-padding-alt":
	                            case "mso-padding-top-alt":
	                            case "mso-padding-right-alt":
	                            case "mso-padding-bottom-alt":
	                            case "mso-padding-left-alt":
	                            case "mso-margin-alt":
	                            case "mso-margin-top-alt":
	                            case "mso-margin-right-alt":
	                            case "mso-margin-bottom-alt":
	                            case "mso-margin-left-alt":
	                            case "mso-table-layout-alt":
	                            case "mso-height":
	                            case "mso-width":
	                            case "mso-vertical-align-alt":
	                                //trace:1819 ff�»������padding��table��
	                                if(!/<table/.test(tag))
	                                    n[i] = name.replace( /^mso-|-alt$/g, "" ) + ":" + ensureUnits( value );
	                                continue;
	                            case "horiz-align":
	                                n[i] = "text-align:" + value;
	                                continue;

	                            case "vert-align":
	                                n[i] = "vertical-align:" + value;
	                                continue;

	                            case "font-color":
	                            case "mso-foreground":
	                                n[i] = "color:" + value;
	                                continue;

	                            case "mso-background":
	                            case "mso-highlight":
	                                n[i] = "background:" + value;
	                                continue;

	                            case "mso-default-height":
	                                n[i] = "min-height:" + ensureUnits( value );
	                                continue;

	                            case "mso-default-width":
	                                n[i] = "min-width:" + ensureUnits( value );
	                                continue;

	                            case "mso-padding-between-alt":
	                                n[i] = "border-collapse:separate;border-spacing:" + ensureUnits( value );
	                                continue;

	                            case "text-line-through":
	                                if ( (value == "single") || (value == "double") ) {
	                                    n[i] = "text-decoration:line-through";
	                                }
	                                continue;


	                            //trace:1870
	//                            //word��ߵ�����ͳһ�ɵ�
	//                            case 'font-family':
	//                                continue;
	                            case "mso-zero-height":
	                                if ( value == "yes" ) {
	                                    n[i] = "display:none";
	                                }
	                                continue;
	                            case 'margin':
	                                if ( !/[1-9]/.test( parts[1] ) ) {
	                                    continue;
	                                }
	                        }

	                        if ( /^(mso|column|font-emph|lang|layout|line-break|list-image|nav|panose|punct|row|ruby|sep|size|src|tab-|table-border|text-(?:decor|trans)|top-bar|version|vnd|word-break)/.test( name ) ) {
	                            if ( !/mso\-list/.test( name ) )
	                                continue;
	                        }
	                        n[i] = name + ":" + parts[1];        // Lower-case name, but keep value case
	                    }
	                }
	                // If style attribute contained any valid styles the re-write it; otherwise delete style attribute.
	                if ( i > 0 ) {
	                    return tag + ' style="' + n.join( ';' ) + '"';
	                } else {
	                    return tag;
	                }
	            } );
	            str = str.replace( /([ ]+)<\/span>/ig, function ( m, p ) {
	                return new Array( p.length + 1 ).join( '&nbsp;' ) + '</span>';
	            } );
	            return str;
	        }

            if ( isWordDocument( html ) ) {
                html = filterPasteWord( html );
            }
            return html.replace( />[ \t\r\n]*</g, '><' );
		}
    };

	//����jQuery���
    $.fn['windeditor'] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, 'windeditor') ) {
            	var instance = new WindEditor( $(this), options );
                $.data(this, 'windeditor', instance);
            }
        });
    };

	//��¶һ��ȫ�ֱ��������������Ҫ
	window['WindEditor'] = WindEditor;

	/**
	* ע�����ӿ�
	*/
	WindEditor.plugin = function(pluginName,pluginFunction) {
		var textarea = $('textarea.wind_editor_textarea');//class Ϊ��ʼ���༭��ʱ��ӵ�textarea
		if(!textarea.length) {
			return;
		}
		//!TODO:���ܴ��Ż�
		textarea.each(function() {
			var instance = $(this).data('windeditor');
			pluginFunction.call(instance,pluginName);
		});
	};

})( jQuery, window);
