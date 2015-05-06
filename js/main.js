var s,
IntervalApp = {
  settings: {
    
    //App-wide Settings
    notes: ["A","B","C","D","E","F","G"],
    chords: ["Amin", "Cmaj", "Dmin", "Emin", "Fmaj", "Gmaj"],
    divisions: {
      whole: 4,
      half: 2,
      quarter: 1
    },
    minute: 60000,
    bpm: 90, 
    selectedChords: [],
    selectedDivision: 4, //TODO add "random"
    timer: null,
    timerNotes: null,
    timerIndex: 0,
    currentChord: null,
    
    // Cached Selectors
    UIItems: {
      chordsSelect: $('select.js-chords-select'),
      chordsList: $('.js-chords-list'),
      chordsAddBtn: $('.js-chords-add-btn'),
      chordsRemoveBtn: $('.js-chords-remove-btn'),
      loopCheckbox: $('.js-loop-checkbox'),
      divisionsSelect: $('.js-divisions-select'), 
      bpmInput: $('.js-bpm-input'),
      startBtn: $('.js-start-btn'),
      stopBtn: $('.js-stop-btn'),
      audioPreloader: $('.js-audio-preloader'),
      audioPreloaderChildren: $('.js-audio-preloader audio'),
      currentNoteBox: $('.js-current-note-box'),
      // Coming Soon. TODO
      displayChordCheckbox: $('.js-display-chord-checkbox'),
      displayChord: $('.js-display-chord'),
      displayNoteCheckbox: $('.js-display-note-checkbox'),
      displayNote: $('.js-display-note')
    }
  },
  
  // Called when dom ready
  init: function(){
    s = this.settings;
    s.UIItems.bpmInput.val(s.bpm);
    this.UIEvents();
    this.preloadNotes(s.UIItems.audioPreloader);
    this.populatePageData(s.chords, s.UIItems.chordsSelect);
    this.populatePageData(s.divisions, s.UIItems.divisionsSelect);
  },
  
  // User Interactions
  UIEvents: function(){
    var self = this;
    s.UIItems.chordsAddBtn.on('click', function(){
      self.addToList(s.UIItems.chordsSelect, s.UIItems.chordsList, s.UIItems.audioPreloader);
    });
    s.UIItems.chordsRemoveBtn.on('click', function(){
      self.removeFromList(s.UIItems.chordsList, s.UIItems.audioPreloader);
    });
    s.UIItems.startBtn.on('click', function(){
      if(s.selectedChords.length < 1){
        alert('no chords selected');
        return;
      }
      s.bpm = s.UIItems.bpmInput.val();
      self.advanceProgression();
      self.advanceNotes();
    });
    s.UIItems.stopBtn.on('click', function(){
      self.stopProgression();
    });
    s.UIItems.divisionsSelect.on('change', function(){
      s.selectedDivision = $(this).val();
      alert(s.selectedDivision);
    });
  },
  
  // Load notes array as audio files
  preloadNotes: function(audioEl){
    $.each(s.notes, function(i, value){
      audioEl.append($('<audio/>', {
        src: 'audio/' + value + '.wav',
        class: value,
        preload: 'auto',
        controls: 'controls',
        text: 'Browser not supported'
      }));
    });
  },
  
  // Fill initial data for selects
  populatePageData: function(arr, target){
    $.each(arr, function(name, value){
      if(name && isNaN(name)){
        target.append($('<option/>', {
          value: value,
          text: name
        }));
      } else {
        target.append($('<option/>', {
          value: value,
          text: value
        }));
      }
    });
  },
  
  // Add chord to chord list
  addToList: function(el, target, audioEl){
    var selectedEl = el.val();
    var newAudioEl = audioEl.find('.' + selectedEl);
    target.append('<div>' + selectedEl + '</div>');
    s.selectedChords.push(selectedEl);
    if(newAudioEl.length < 1){
      audioEl.append($('<audio/>', {
        src: 'audio/' + selectedEl + '.wav',
        class: selectedEl,
        preload: 'auto',
        controls: 'controls',
        text: 'Browser not supported'
      }));
    }
  },
  
  removeFromList: function(el, audioEl){
    el.find("div:last").remove();
    s.selectedChords.pop();
    // TODO cleanup audio elements
    //audioEl.find("audio:last").remove();
  },
  
  advanceProgression: function(){
    var self = this;
    s.timer = setTimeout(function(){
      console.log(s.timerIndex, s.selectedChords.length);
      self.advanceProgression();
    }, ((s.minute/s.bpm)*4));
    if(s.timerIndex === s.selectedChords.length){
      if(!s.UIItems.loopCheckbox.is(':checked')){
        window.clearInterval(s.timer);
        window.clearInterval(s.timerNotes);
        s.timerIndex = 0;
      } else {
        s.timerIndex = 1;
        s.currentChord = s.selectedChords[s.timerIndex];
        $('.'+s.currentChord)[0].pause(); // Stop playing
        $('.'+s.currentChord)[0].currentTime = 0; // Reset time
        $('.'+s.currentChord)[0].play();
        
      }
    } else {
      s.currentChord = s.selectedChords[s.timerIndex];
      $('.'+s.currentChord)[0].pause(); // Stop playing
      $('.'+s.currentChord)[0].currentTime = 0; // Reset time
      $('.'+s.currentChord)[0].play();
      s.timerIndex++;
    }
  },
  
  advanceNotes: function(){
    var currentNote;
    var self = this;
    s.timerNotes = setTimeout(function(){
      self.advanceNotes();
    }, ((s.minute/s.bpm)*s.selectedDivision));
    var currentNote = s.notes[Math.floor(Math.random()*s.notes.length)];
    $('.'+currentNote)[0].pause(); // Stop playing
    $('.'+currentNote)[0].currentTime = 0; // Reset time
    $('.'+currentNote)[0].play();
    s.UIItems.currentNoteBox.text(currentNote);
  },
  
  stopProgression: function(){
    window.clearInterval(s.timer);
    window.clearInterval(s.timerNotes);
    s.timerIndex = 0;
  }
};

$(window).load(function(){
  IntervalApp.init();
});