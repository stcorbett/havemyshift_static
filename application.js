  // We are using non-conflict jquery.  See vendor/plugins/jrails/init.rb where we specify:
  // ActionView::Helpers::PrototypeHelper::JQUERY_VAR = "$j"
  // and below where we specify:
  // var $j = jQuery;

var $j = jQuery;

$j(document).ready(function() {
  $j('a[rel*=facebox]').facebox()
  setTimeout( '$j("#site-notice").fadeIn(2000)', 1000);

  $j("form").submit(
    function() {
      $j("#submitbutton").attr("disabled", "true");
      $j("#submitbutton").attr("value", "Submitting...Please wait");
    }
  );

  $j('input[placeholder],textarea[placeholder]').placeholder();

  if ($j("#one_time_message").length == 1){
    $j("#one_time_message_link").click();
  }

  if ($j("#coming_soon_message").length == 1){
    $j("#coming_soon_message_link").click();
  }

  if ($j("#suggested_shifts").length == 1){
    $j("#suggested_shifts_link").click();
  }

  $j("#broadcast_preview_link").click( function() {
    jQuery.ajax({
       type: "POST",
       url: "/broadcast/preview",
       data: ({
         "market_id": $("#new_broadcast #market_id").val(),
         "broadcast[subject]": $("#new_broadcast :input#broadcast_subject").val(),
         "broadcast[body]": $("#new_broadcast :input#broadcast_body").val()
       }),
       success: function(msg){
         alert("preview sent.");
       }
     });
    
  });

  $j('#note_shift_check_box').click(function() {
    $j(".note_shift_fields").toggle(this.checked);
  });

  $j("#note_shift_image").click(function() {
    $j('#note_shift_check_box').click();
    $j(".note_shift_fields").toggle(
        $j('#note_shift_check_box').is(':checked')
      );
  });

});

function updateOfferFields(full_name, selected_user_id){
  $j('.user_full_name').each(function() {
    $j(this).text(full_name);
  });
  $j('.agreement_check_box').each(function() {
    $j(this).attr('checked', false);
  });
}

function enableSubmits(){
  $j('input[type=submit]').attr('disabled', false);
}

function companySelectedOnJoin(event, data, formatted){
  // extra[0] is the first extra cell returned with the li in the AJAX response
  $j("#user_company_id").val(data[1]); // set the hidden company id field
}

function formatCompanyLi(li){
  return li[0] + " " + li[2]
}

function SimpleSwap(el,which){
  el.src=el.getAttribute(which || "origsrc");
}

function SimpleSwapSetup(){
  var x = document.getElementsByTagName("img");
  for (var i=0;i<x.length;i++){
    var oversrc = x[i].getAttribute("oversrc");
    if (!oversrc) continue;

    // preload image
    // comment the next two lines to disable image pre-loading
    x[i].oversrc_img = new Image();
    x[i].oversrc_img.src=oversrc;
    // set event handlers
    x[i].onmouseover = new Function("SimpleSwap(this,'oversrc');");
    x[i].onmouseout = new Function("SimpleSwap(this);");
    // save original src
    x[i].setAttribute("origsrc",x[i].src);
  }
}

// this is not jquery, it's Prototype, for now
function CalendarUpdateEndDate(date){
  var d = new Date(date.value);
  var end_date = new Date($("shift[end_time]").value);
  end_date.setMonth(d.getMonth()); end_date.setYear(d.getFullYear()); end_date.setDate(d.getDate());
  $("shift[end_time]").setValue(end_date.toFormattedString(true));
}

// this is not jquery, it's Prototype, for now
function CalendarShowEndDate(){
  $("shift_end_date_block").style.display = ""
}

// this is not jquery, it's Prototype, for now
function initializeCalendarInputLink(input_id){
  $(input_id).onclick = function clickingCalendarOpen() {$(input_id).next().onclick();};
}

function tap_submitbutton_for_ie7(){
  $j('#submitbutton').css({'top': '1px'});
  $j('#submitbutton').css({'top': '-1px'});
}

function eShiftUpdateFields(){
  if ($("e_shift_check_box") && $("e_shift_check_box").checked){
    $j('.e_shift_fields').slideDown('fast', function() {
      $j(".e_shift_fee").show();
      $j(".lead_fee").hide();
      $j(".payment_form_row").show();
      tap_submitbutton_for_ie7();
    });
    if ($("note_shift_check_box") && !$("note_shift_check_box").checked){
      $('note_shift_check_box').checked = true
    }
  }
  else{
    $j('.e_shift_fields').slideUp('fast', function() {
      $j(".e_shift_fee").hide();
      $j(".lead_fee").show();
      tap_submitbutton_for_ie7();
    });
    if ($("note_shift_check_box") && $("note_shift_check_box").checked){
      $('note_shift_check_box').checked = false
    }
  }

  $j(".note_shift_fields").toggle(
    $j('#note_shift_check_box').is(':checked')
  );
}

function createPosition(){
  $j('#create_select_position').hide();
  $j('#create_position').show();
}

function selectPosition(){
  $j('#user_position_name').val("");
  $j('#create_position').hide();
  $j('#create_select_position').show();
}

function createOpening(start_time) {
  $j.post('/openings', 
    {start_time: start_time}, function(response){ 
    eval(response);
    $j("#opening\\[start_time\\]").next().attr( 'src', '/images/calendar_date_select/calendar.gif');
  });
}

function grab_interested_users(shift_id) {
  jQuery.facebox(function() {
    jQuery.get('/shifts/' + shift_id + '/ajax_fetch_interested', [], function(data) {
      if ($j('#user_list').children().length == 0){
        $j('#user_list').append(data);
      } else {
        $j('#user_list').html(data); // replace children vs append
      }
      $j('#shift_id').replaceWith('<input id="shift_id" type="hidden" name="shift_id" value="' + shift_id + '"/>');
      jQuery.facebox($j('#recommendation_form').html());
    })
  });
}

////
// Behaviors

var FieldMagic = {
  initField : function (element) {
    FieldMagic.defaultText(element);
    FieldMagic.blurField(element);
    FieldMagic.focusField(element);
  },
  defaultText : function (element) {
    if ($j(element).val() === $j(element).attr("magic")) {
      $j(element).css({'color' : '#B3B3B3'});
    }
    if ($j(element).val() === '') {
      $j(element).css({'color' : '#B3B3B3'});
      $j(element).val($j(element).attr("magic"));
    }
  },
  focusField : function (element) {
    element.focus(function() {
      if ($j(this).val() === $j(this).attr("magic")) {
        $j(this).val('');
        $j(this).css({'color' : '#000'});
      }
    });
  },
  blurField : function (element) {
    element.blur(function() {
      if ($j(this).val() === '') {
        FieldMagic.defaultText(element);
      }
    });
  },
  clearDefaultField : function (element) {
    if (element.attr("magic") === undefined ) {
      return false
    } else {
      if (element.val() === element.attr("magic")) {
        element.val('');
      }
    }
  }
}; // END FieldMagic

toggleShiftState = function(shift) {
  jQuery.ajax({
     type: "PUT",
     url: "/shifts/" + shift.id,
     data: ({
       "id": shift.id,
       "shift[event]": shift.rel
     }),
     success: function(msg){
       window.location.reload();
     }
   });
};

$j(document).ready(function () {
  
  jQuery.each($j("input[magic], textarea[magic]"), function() {
    FieldMagic.initField($j(this));
  });
  
  jQuery.each($j("form"), function() {
    $j(this).submit(function() {
      jQuery.each($j("input[magic], textarea[magic]"), function() {
        FieldMagic.clearDefaultField($j(this));
      })
    })
  });
  
  $j('.toggleState').each(function() {
    $j(this).click(function(link) {
      link.preventDefault();
      toggleShiftState(this);
    });
  });

});

jQuery.ajaxSetup({ 
  'beforeSend': function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")} 
})
