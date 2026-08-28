/* Expose app.js global-lexical data needed by the Rogue balance layer. */
(function(){
    try{ if(typeof RATCHETS!=="undefined") window.RATCHETS=RATCHETS; }catch(_e){}
    try{ if(typeof calculateComboStats==="function") window.calculateComboStats=calculateComboStats; }catch(_e){}
    try{ if(typeof selectableBits==="function") window.selectableBits=selectableBits; }catch(_e){}
})();
