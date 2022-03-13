// **************************************************************************************
// "Live2D_Prepro_Plus" v0.1
// Copyright (c) 2022 MoriwakiYuuya(yprops)
// This software is released under the MIT License.
// https://opensource.org/licenses/mit-license.php
// 
// 
// このファイルは、Adobe Photoshop CC 用 Javascriptであり、下記スクリプトを基に機能追加したものです。
// This is Javascript for Adobe Photoshop CC, based on the below with some additional functions.
// 
// 
// "Live2D_Preprocess" v1.4
// https://www.live2d.com/download/ps-script/
// Copyright (c) 2018 Live2D inc.
// This software is released under the MIT License.
// https://opensource.org/licenses/mit-license.php
// 
// 
// 【元の機能】  original script's function
// ・レイヤー名に"*"を含まないレイヤーセットを結合する。
//   merge layer sets include '*' in their names.
// 
// 【追加機能】 additional functions
// ・レイヤー名に"~"を含むレイヤー、レイヤーグループを削除する。
//   remove layers/layer sets include '~' in their names.
//   (結合されるレイヤーセット内にある"~"付きレイヤーは削除されません。
//    in merged layer sets, '~'layers cannot be removed. )
// ・ファイル名に指定の接尾辞をつけて別名保存する。
//   save as other file with name suffix.
// 
// 
// 更新履歴
// ・2022/03/12 初出
// 
// **************************************************************************************
(function (){




// =========== settings =============
// 別名保存したくなければ false
var DO_SAVEAS_WITH_SUFFIX = true;
// 接尾辞
var RESULT_SUFFIX = '_prepro';






// ============ main flow ==============
var SCRIPTNAME = 'L2D_Prepro_Plus';

//別名保存用ファイルオブジェクト作成＆エラーチェック
if(DO_SAVEAS_WITH_SUFFIX){
    try{
        var ResultFile = GetFileObjWithSuffix(RESULT_SUFFIX);
    }catch(e){
        alert(SCRIPTNAME + ': ' + e.message);
        return;
    }
}

// レイヤー加工。ヒストリーを一行にまとめる。
var Layers = activeDocument.layers;
activeDocument.suspendHistory("フォルダを結合","LayerCheck(Layers)");


//別名保存
if(DO_SAVEAS_WITH_SUFFIX){
    try{
        activeDocument.saveAs(ResultFile);
        alert('Save as "' + ResultFile.name + '" is succeeded!\nファイル名"' + ResultFile.name + '"で保存しました。', 'message');
    }catch(e){
        alert(SCRIPTNAME + ': ' + e.message);
        return;
    }
}






// ============ methods ==============



function LayerCheck(LayerList){
    var i, Targets, SelectLayer, LayerType, Vflag;

    //  ===  パスの削除処理 start  =======
    var docRef = app.activeDocument;
    var PathItems = docRef.pathItems;
    var numPath = PathItems.length;
    for(var i = 0; i < numPath;i++){
        var PathItem = PathItems[0];
        PathItem.remove();
        }
    //  ===  パスの削除処理 end  =======
    var qmask = docRef.quickMaskMode;
    if(qmask == true){
        docRef.quickMaskMode = false;
        }
    
    //  ===  本編用配列を作成して不要レイヤーを削除  =======
    Targets = [];
    var trash = [];
    for (i = 0 ; i < LayerList.length ; i++){
        SelectLayer = LayerList[i];
        activeDocument.activeLayer = SelectLayer;
        if(SelectLayer.name.match(/\~/g) != null){
            trash.push(SelectLayer);
        }else{
            Targets.push(SelectLayer);
        }
    }
    for (i = 0 ; i < trash.length ; i++){
        activeDocument.activeLayer = trash[i];
        activeDocument.activeLayer.remove();
    }
    trash = null;

    //  ===  本編　===
    Vflag = false;
    for (i = 0 ; i < Targets.length ; i++){
        SelectLayer = Targets[i];
        LayerType = SelectLayer.typename;
        if(SelectLayer.visible == false){
            Vflag = true;
            }
        activeDocument.activeLayer = SelectLayer;

        if(LayerType == "LayerSet"){
            if(SelectLayer.name.match(/\*/g) != null ){
                if(Vflag == true){
                    activeDocument.activeLayer.visible = false;
                    }
                LayerCheck(SelectLayer.layers);//  「*」付きのレイヤーセットの場合は再帰処理
                }
            else{
                activeDocument.activeLayer.merge();
                }
            }
        
        if(activeDocument.activeLayer.typename == "ArtLayer" && hasLayerMask() == true){
            if(MaskEnabled() == true){
                applyLayerMask();
                }
            else{
                selectLayerMask();
                deleteMask();
                }
            }

        if(Vflag == true){
            activeDocument.activeLayer.visible = false;
            Vflag = false;
            }
        }
    
    };

// === レイヤーマスクがあるかどうかの判定
function hasLayerMask() {
    var hasLayerMask = false;
    try {
        var ref = new ActionReference();
        var keyUserMaskEnabled = app.charIDToTypeID( 'UsrM' );
        ref.putProperty( app.charIDToTypeID( 'Prpr' ), keyUserMaskEnabled );
        ref.putEnumerated( app.charIDToTypeID( 'Lyr ' ), app.charIDToTypeID( 'Ordn' ), app.charIDToTypeID( 'Trgt' ) );
        var desc = executeActionGet( ref );
        if ( desc.hasKey( keyUserMaskEnabled ) ) {
            hasLayerMask = true;
            }
        }catch(e) {
            hasLayerMask = false;
            }
        return hasLayerMask;
        };

//  レイヤーマスクの適用
function applyLayerMask(){
    try{
    var idDlt = charIDToTypeID( "Dlt " );
    var desc78 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref29 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idChnl = charIDToTypeID( "Chnl" );
    var idMsk = charIDToTypeID( "Msk " );
    ref29.putEnumerated( idChnl, idChnl, idMsk );
    desc78.putReference( idnull, ref29 );
    var idAply = charIDToTypeID( "Aply" );
    desc78.putBoolean( idAply, true );
    executeAction( idDlt, desc78, DialogModes.NO );
    }catch(e){};
    };

//  レイヤーマスクが有効か無効か判定
function MaskEnabled(){
    var ref = new ActionReference();  
    ref.putProperty(charIDToTypeID('Prpr'),stringIDToTypeID("userMaskEnabled"));  
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var maskFlag = executeActionGet(ref).getBoolean (stringIDToTypeID("userMaskEnabled"));
    return maskFlag;
}

//  レイヤーマスクを削除
function deleteMask(){
    var idDlt = charIDToTypeID( "Dlt " );
    var desc60 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref28 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref28.putEnumerated( idChnl, idOrdn, idTrgt );
    desc60.putReference( idnull, ref28 );
    executeAction( idDlt, desc60, DialogModes.NO );
}

//  =====  レイヤーマスクがあった場合に選択する関数
function selectLayerMask() {
    try{ 
        var id759 = charIDToTypeID( "slct" );
        var desc153 = new ActionDescriptor();
        var id760 = charIDToTypeID( "null" );
        var ref92 = new ActionReference();
        var id761 = charIDToTypeID( "Chnl" );
        var id762 = charIDToTypeID( "Chnl" );
        var id763 = charIDToTypeID( "Msk " );
        ref92.putEnumerated( id761, id762, id763 );
        desc153.putReference( id760, ref92 );
        var id764 = charIDToTypeID( "MkVs" );
        desc153.putBoolean( id764, false );
        executeAction( id759, desc153, DialogModes.NO );
        }
        catch(e){

        }
    }

/**
 * =====  接尾辞をつけたファイルオブジェクトを作成。
 * @param fileSuffix 接尾辞
 * @return File
 */
function GetFileObjWithSuffix(fileSuffix){
    var doc = app.activeDocument;
    var splited, fileExtension, fileName;

    //保存済みか
    try{
        doc.path
    }catch(e){
        throw new Error('save psd before use this script.\nPSDファイルが保存されていません。');
        return;
    }
    //ファイル名チェック
    splited = doc.name.split(".");
    if(splited.length > 1){
        fileExtension = splited[splited.length - 1]
        //.psdか
        if(!fileExtension.match(/^psd$/i)){
            throw new Error('file extension is not ".psd"\n拡張子が".psd"ではありません。');
            return;
        }
        //suffix重複していないか
        if(
            splited[0].length >= fileSuffix.length &&
            splited[0].lastIndexOf(fileSuffix) == splited[0].length - fileSuffix.length
        ){
            throw new Error('suffixes can\'t be doubled.\n接尾辞"' + fileSuffix + '"が重複します。');
            return;
        }
        //変更保存済みか
        if(!doc.saved){
            throw new Error('save file before use this script\n変更を保存したPSDファイルで実行してください。');
            return;
        }
    }else{
        throw new Error('invalid file name\n元ファイルの名前が不正です。');
        return;
    }

    splited[0] += fileSuffix;
    fileName = splited.join(".");
    return new File(decodeURI(doc.path)+'/'+ fileName);
}



})();