/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-����-��������
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), region, school
 * $Id$
 */
 
Wind.use('ajaxForm', function(){

	var edu_list = $('#J_edu_list'),
		edu_op_wrap = $('#J_edu_op_wrap'),				//��ӱ༭��
		edu_form = $('#J_edu_form'),							//��
		edu_select = $('#J_edu_select'),
		edu_input = edu_form.find('input.J_plugin_school'),				//��λ
		edit_id = $('#J_edit_id'),										//�༭id
		startyear = $('#J_startyear'),
		work_none = $('#J_work_none');

	//id��Ӧ�ı�ʶת��
	$('input.J_plugin_school').each(function(){
		if($(this).data('typeid') == 3) {
			$(this).data('rank', 'province');
		}else{
			$(this).data('rank', '');
		}
	});

	Wind.use('region', 'school', function(){
		$('input.J_plugin_school').region({
			type : 'school'
		});
	});

	//���
	$('#J_edu_add').on('click', function(e){
		e.preventDefault();
		edu_op_wrap.insertAfter($('#J_edu_list > li:eq(0)')).show().siblings(':hidden').show();
		edu_form.resetForm();
		edu_form.attr('action', URL_EDU_ADD).data('role', 'add');			//�޸��ύ��ַ

		edu_input.data({
			typeid : getTypeid(edu_select.val())[0],
			rank : getTypeid(edu_select.val())[1],
			pid : '',
			cid : '',
			did : '',
			sid : ''
		}).val('');
		work_none.hide();
	});

	$('#J_edu_add_trigger').on('click', function(e){
		e.preventDefault();
		$('#J_edu_add').click();
	});

	//ѧ��
	edu_select.on('change', function(){
		var v = $(this).val();

		edu_input.data({
			typeid : getTypeid(v)[0],
			rank : getTypeid(v)[1],
			pid : '',
			cid : '',
			did : '',
			sid : ''
		}).val('');

		$('#J_region_pop').hide();
	});
	
	//ѧУ�༭
	edu_list.on('click', 'a.J_school_edit', function(e){
		e.preventDefault();
		var $this = $(this),
				parent = $this.parents('li');
		
		parent.hide();
		parent.siblings(':hidden').show();
		//work_add.show();
		edu_op_wrap.insertAfter(parent).show();
		edu_form.attr('action', this.href).data('role', 'edit');						//�޸��ύ��ַ
		edu_select.val($this.data('degreeid'));						//ѧ��
		edu_input.val($this.data('school')).data({
			'pid' : $this.data('pid'),
			'cid' : $this.data('cid'),
			'did' : $this.data('did'),
			'sid' : $this.data('schoolid'),
			'typeid' : getTypeid($this.data('degreeid'))[0],
			'rank' : getTypeid($this.data('degreeid'))[1]
		});
		
		edit_id.val($this.data('schoolid'));							//ѧУid
		$('#J_startyear').val($this.data('startyear'));		//��ѧ���

	});
	
	//�ύ
	edu_form.ajaxForm({
		dataType : 'json',
		success : function(data){
			if(data.state === 'success') {
				var role = edu_form.data('role');
				edu_op_wrap.hide();

				if(role == 'add') {
					edu_op_wrap.before('<li> <span class="fr">\
						<a class="mr20 J_school_edit" data-startyear="'+ startyear.val() +'" data-schoolid="'+ edu_input.data('sid') +'" data-school="'+ edu_input.val() +'" data-degreeid="'+ edu_input.data('degreeid') +'" data-did="'+ edu_input.data('did') +'" data-cid="'+ edu_input.data('cid') +'" data-pid="'+ edu_input.data('pid') +'" href="#">�༭</a>\
						<a class="J_edu_del" href="#">ɾ��</a></span>\
						<span class="edu">'+ edu_select.children(':selected').text() +'</span> <span class="unit">'+ edu_input.val() +'</span> <span class="time">'+ startyear.val() +'��</span>\
					</li>');

					window.location.reload();
				}else{
					var hidden = edu_op_wrap.siblings(':hidden');
					hidden.show().find('span:eq(1)').text(edu_select.children(':selected').text());
					hidden.find('span:eq(2)').text(edu_input.val());
					hidden.find('span:eq(3)').text(startyear.val() +'��');
					hidden.find('a.J_school_edit').data({
						'startyear' : startyear.val(),
						'schoolid' : edu_input.data('schoolid'),
						'school' : edu_input.val(),
						'pid' : edu_input.data('pid'),
						'cid' : edu_input.data('cid'),
						'did' : edu_input.data('did'),
						'degreeid' : edu_select.val()
					});
				}
			}else if(data.state === 'fail'){
				Wind.Util.resultTip({
					error : true,
					msg : data.message
				});
			}
		}
	});
	
	//ɾ������ global.js
	edu_list.on('click', 'a.J_edu_del', function(e){
		e.preventDefault();
		var $this = $(this);
		Wind.use('dialog', function(){
			Wind.Util.ajaxConfirm({
				href : $this[0].href,
				elem : $this,
				callback : function(){
					$this.parents('li').slideUp('fast', function(){
						$(this).remove();
					});
				}
			});
		});
	});
	
	//ȡ��
	$('#J_edu_cancl').on('click', function(e){
		e.preventDefault();
		edu_op_wrap.siblings(':hidden').show();
		edu_op_wrap.hide();
		/*work_add.show();
		work_none.show();*/
	});


	function getTypeid(v){
		var typeid,
			rank = '',
			v = parseInt(v);

		if(v === 1) {
			typeid = 1;
		}else if(v === 2 || v === 3){
			typeid = 2;
		}else{
			typeid = 3;
			rank = 'province'
		}

		return [typeid, rank];
	}

});