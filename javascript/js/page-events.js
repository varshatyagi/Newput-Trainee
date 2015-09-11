/* js class */
var PageHandler = function(){
	booksById = '';
	var _elem = '';
	var _renderId = '';
	var _link = '' ;
	var _className = '';
	var _id = '';
	var _linkId = '';
	var desc = '';
	var _rendered = '';
	count = 1;
	this.book = function(elem, renderId, loadingImage, className){
		var status = '';
		var link = '';
		$('.'+elem).click(function(){
			/* set active status to navigation */
			$('.'+elem).removeClass(className);
			$(this).addClass(className);
			/* set active status to navigation */
			var status = $(this).attr('data-atribute');
			if(status == 'php'){
				link = 'http://it-ebooks-api.info/v1/search/php/page/'+count;
			}else if(status == 'java'){
				link = 'http://it-ebooks-api.info/v1/search/java/page/'+count;
			}else{
				link = 'http://it-ebooks-api.info/v1/search/mysql/page/'+count;
			}
			$('.'+loadingImage).show();
			$.ajax({
				url: link,
				method : 'GET'
			}).success(function(data){				
				for(var book in data.Books){
					var desc = data.Books[book].Description;
					data.Books[book].shortDescription = desc.substr(0,50);
					var id = 'key-'+book;
					data.Books[book].id = id;
				}
				 booksById = data;
				_renderTemplate(booksById, renderId, 'mustache-template.js', loadingImage);
			}).error(function(){
				console.log('error');
			});
		});
	}
	/* function to render the mustache template */
	var _renderTemplate = function(booksById, renderId, templateName, loadingImage = ''){
		$.ajax({
		  url: 'templates/'+templateName,
		  method : 'GET',
		  dataType: 'html'
		}).success(function(template){
			//parseTemplate = Mustache.parse(template); 
			_rendered = Mustache.render(template, booksById);
			if(loadingImage != ''){
				$('.'+loadingImage).hide();
			}
			$("#"+renderId).html(_rendered); 
		});
	}
	/* function end */
	
    /* function for menu active status */
	this.defaultStatus = function(elem, className, renderId, attribute){
		_elem = elem;
		_className = className;
		dataAttribute = attribute ;
		if($('.'+_elem).hasClass('active')){
			$('.'+_className).trigger('click');
		}
	}
	/* function end */
	
	/* function to handle navigation active status */
	this.activeLink = function(linkId, className){
		_linkId = linkId;
		_className = className;
		$('.'+_linkId).click(function(event){
			$('.'+_linkId).removeClass(className);
			$(this).addClass(className);
			if(dataAttribute != $(this).attr('data-atribute'))
			{
				status = 'false';
				dataAttribute = $(this).attr('data-atribute');
				count = 1;
			}else{
				status = 'true';
				count++;
			}
		});
	}
	/* function end */
	
	/* fucntion to show pop up box on click handler */
	this.showPopUp = function(event, container){
		var _bookId = event;
		_arr = _bookId.split('-');
		_bookId = _arr['2'];
		var containerId = container;
		_renderTemplate(booksById.Books[_bookId], containerId, 'article-template.js', 'loadingImage');	
	}
	/* fucntion end */
	
	/* empty the pop up box */
	this.emptyPopup = function(container){
		$('#'+container).html('');
	}
	/* function end */
}
/*end of classes*/