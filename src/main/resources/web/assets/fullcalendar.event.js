var tempEvent;

(function($, undefined) { 
    $.fn.eventCal = function(params) {
        var defaultCalendarOptions = {
            events: params.baseUrl + 'list',
            selectable: true,
            droppable: true,
            dropAccept:'.list-event',
            drop: function(date, allDay) {
                var originalEventObject = $(this).data('eventObject');
                var copiedEventObject = $.extend({}, originalEventObject);
                copiedEventObject.start = date;
                var dateEnd = new Date(date);
                dateEnd.setMinutes(dateEnd.getMinutes()+params.calendar.slotMinutes*2);
                copiedEventObject.end = dateEnd;
                copiedEventObject.allDay = allDay;
                copiedEventObject.editable = true;
                $.post(params.baseUrl + 'update',
                {
                    eventId : 0,
                    start   : copiedEventObject.start.getTime()/1000,
                    title   : copiedEventObject.title,
                    end     : copiedEventObject.end.getTime()/1000,
                    allDay  : copiedEventObject.allDay,
                    editable: true
                },
                function(returnId)
                {
                    copiedEventObject.id = returnId;
                    $('#EventCal').fullCalendar('renderEvent', copiedEventObject);
                    
                });
                if ($('#drop-remove').is(':checked'))
                {
                    $(this).remove();
                    $.post(params.baseUrl + 'removeHelper',
                    {
                        title : copiedEventObject.title
                    });
                }
            },
            loading: function(bool) {
                if (bool) $('#loading').show();
                else $('#loading').hide();
            },
            eventDrop: function(event, dayDelta, minuteDelta, allDay)
            {
                if(!event.editable) return false;
                $.post(params.baseUrl + 'move',
                {
                    eventId:event.id,
                    delta:(dayDelta*86400+60*minuteDelta),
                    allDay:allDay
                } );
                return false;
            },
            eventResize: function(event, dayDelta, minuteDelta)
            {
                if(!event.editable) return false;
                $.post(params.baseUrl + 'resize',
                {
                    eventId:event.id,
                    delta:(dayDelta*86400+60*minuteDelta)
                } );
                return false;
            },
            eventClick: function(event)
            {
                if(!event.editable) return false;
                tempEvent = event;
                $('#EventCal_id').val(event.id);
                $('#EventCal_title').val(event.title);
                setupStartAndEndTimeFields(event.start, event.end);
                $('input[name=EventCal_allDay]').attr('checked', event.allDay);
                $('input[name=EventCal_editable]').attr('checked', event.editable);
                $('#dlg_EventCal').dialog('open');
                return false;
            },
            dayClick: function(date, allDay)
            {
                tempEvent = new Object();
                $('#EventCal_id').val(0);
                $('#EventCal_title').val('');
                $('input[name=EventCal_allDay]').attr('checked', allDay);
                $('input[name=EventCal_editable]').attr('checked', true);
                var dateEnd = new Date(date);
                dateEnd.setMinutes(dateEnd.getMinutes()+params.calendar.slotMinutes*2);
                setupStartAndEndTimeFields(date, dateEnd);
                $('#dlg_EventCal').dialog('open');
                return false;
            }
        }

        /*
             * Sets up the start and end time fields in the calendar event
             * form for editing based on the calendar event being edited
             */
        setupStartAndEndTimeFields = function(dateStart, dateEnd)
        {
            var minHours, minMin, maxHours, maxMin, tempDate;
            var minArr = params.calendar.minTime.split(':');
            var maxArr = params.calendar.maxTime.split(':');
            minHours = parseInt(minArr[0]);
            minMin = parseInt(minArr[1]);
            maxHours = parseInt(maxArr[0]);
            maxMin = parseInt(maxArr[1]);
            tempDate = new Date(dateStart);
            $('#EventCal_start').empty();
            $('#EventCal_end').empty();
            var timeSlot = minMin;
            for (var i = minHours; i <= maxHours; i++)
            {
                while(timeSlot < 60) {
                    var i_str = ( i<10 )? '0'+i : i;
                    tempDate.setHours(i);
                    tempDate.setMinutes(timeSlot);
                    var timeSlot_str = ( timeSlot < 10 )? '0'+timeSlot : timeSlot;
                    var t = i_str + ':' + timeSlot_str;
                    var selStart = (tempDate.getTime() == dateStart.getTime())? ' selected' : '';
                    var selEnd = (tempDate.getTime() == dateEnd.getTime())? ' selected' : '';
                    $('#EventCal_start').append('<option'+selStart + ' value="'+tempDate.getTime()/1000 + ''>' + t + '</option>');
                    $('#EventCal_end').append('<option'+selEnd + ' value=''+tempDate.getTime()/1000 + ''>' + t + '</option>');
                    timeSlot += params.calendar.slotMinutes;
                    if(i == maxHours && timeSlot>maxMin) timeSlot = 60;
                }
                timeSlot = 0;
            }
        }

        eventDialogOK = function()
        {
            var data =
            {
                eventId: $('#EventCal_id').val(),
                title: $('#EventCal_title').val(),
                start: $('#EventCal_start').val(),
                end: $('#EventCal_end').val(),
                allDay: $('input[name=EventCal_allDay]').attr('checked'),
                editable: $('input[name=EventCal_editable]').attr('checked')
            }

            $.post(params.baseUrl + 'update',
                data,
                function(returnId)
                {
                    switch(returnId)
                    {
                        case '0':
                            $('#EventCal').fullCalendar( 'removeEvents', tempEvent.id);
                            break;
                        case data.eventId:
                            tempEvent.id = returnId;
                            tempEvent.title = data.title;
                            tempEvent.start = data.start;
                            tempEvent.end = data.end;
                            tempEvent.allDay = data.allDay;
                            tempEvent.editable = data.editable;
                            $('#EventCal').fullCalendar( 'updateEvent', tempEvent);
                            break;
                        default:
                            tempEvent.id = returnId;
                            tempEvent.title = data.title;
                            tempEvent.start = data.start;
                            tempEvent.end = data.end;
                            tempEvent.allDay = data.allDay;
                            tempEvent.editable = data.editable;
                            $('#EventCal').fullCalendar( 'renderEvent', tempEvent);
                            break;
                    }
                }
                );
            $('#dlg_EventCal').dialog('close');
        }

        createNewEvent = function()
        {
            var newTitle = prompt(params.newEventPromt, '');
            if(newTitle) {
                $.post(params.baseUrl + 'createHelper',
                {
                    title : newTitle
                });
                $('#event-scrooler').append('<div class="list-event">'+newTitle + '</div>');
                setEventsDraggable();
            }
        }

        userpreferenceOK = function()
        {
            var data = $('#dlg_Userpreference > form').serialize();
            $.post(params.baseUrl + 'userpreference', data);
            $('#dlg_Userpreference').ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex"),this.headers.find("a").removeAttr("tabIndex"),this._destroyIcons();var c=this.headers.next().css("display","").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");return(b.autoHeight||b.fillHeight)&&c.css("height",""),a.Widget.prototype.destroy.call(this)},_setOption:function(b,c){a.Widget.prototype._setOption.apply(this,arguments),b=="active"&&this.activate(c),b=="icons"&&(this._destroyIcons(),c&&this._createIcons()),b=="disabled"&&this.headers.add(this.headers.ne