// My own Inline editing
;(function($) {
  
  var resource, resource_attr, field;
  var $inlines, $inline, $previous_inline = $();             
  var settings = {
    'autoreset': true,
    'field' : "input",
    'controls': false,
    'attrs':{}
  };
                     
  $.fn.inlines = function(options) {
    if (options) $.extend(settings, options);
    
    $inlines = $(this);
    resource = $inlines.attr("id")
    
    clickInlineEvent();
    return this;
  };
    
  function clickInlineEvent() {
    $inlines.delegate("[data-inline]", "click.inline", function(event) {
      //console.log("click setup");
      
      // if it exist restore the previous edit form to pure text
      if($previous_inline.length && settings.autoreset) {
        $previous_inline.trigger("reset.inline");        
      }
      
      //
      $inline = $(event.target);
      resource_attr = $inline.attr("class")
      if(!resource_attr) return;
      
      // $previous_inline is $inline now
      // so it gets cleaned up on next click      
      $previous_inline = $inline;
      $previous_inline.data("text", $inline.text() )    
      
      $inline
        .bind("createform.inline", createForm)
        .trigger("createform.inline") 
        .unbind(".inline")
        .bind("reset.inline", resetInline) 
    })
  };
    
  function resetInline(event) {
    //console.log("reset to initial state")
    var $el = $(event.target)
    $el.html($el.data("text")).effect("highlight")
    $el.unbind("reset.inline");    
  };
  
  // TODO : consider building form as seperate/reusable module
  function createForm(event) {
    //console.log("createForm")
    var $el = $(event.target);
    var $form =  $("<form method='post'></form>")
    
    setFormField($form)
    if($form.find("textarea").length) setFormControls($form, $el) 
    
    // Adding the PUT method to form
    $form.attr("action", $el.parent("tr").attr("data-inline"))
      .click(function(event) { event.stopPropagation() })
      .append('<input name="_method" type="hidden" value="put">')
    //$form.append('<input name="'+csrf_param+'" value="'+csrf_token+'" type="hidden" />')    
    
    $el.html( $form );
    $form.bind("submit.inline", submitForm)
  };
  
  function setFormControls(form, inline) {
    form.append("<input type='submit' value='save' />or <a href=''>close</a></form>");
    form.find("a").click(function() {
      inline.trigger("reset.inline")
      return false;
    })
  };
  
  function setFormField(form, inline) {
    //console.log("create form field", $inline.attr("data-field"))
    var field = $inline.attr("data-field");
    field ? field = field : field = settings.field
    field == "input" ? field = $('<input type="text" />') : field = $('<textarea />')      
    
    field.val( $.trim($inline.text()) )
      .attr("name", "performance[" + resource_attr + "]")
      .effect("highlight")
      
    form.append(field)
    field.focus()
  };
  
  function submitForm(event) {
    var $form   = $(event.target)
    var action  = $form.attr("action"),
        data    = $form.serialize();
        
    $.post(action, data, function(result) {
      var obj = $.parseJSON(result);
      $inline.html(obj.attrs[resource_attr]).effect("highlight");
      $inline.unbind(".inline")
    });
    return false;
  };
    
})(jQuery)