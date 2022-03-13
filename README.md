# Live2D_Prepro_Plus.jsx v0.1

このファイルは、Adobe Photoshop CC 用 Javascriptです。  
Live2D用の素材PSDファイルを、Cubism Editorへのインポートに適した形に加工します。  
*This is Javascript for Adobe Photoshop CC.  
This script modifies PSD file made for Live2D to import to Cubism Editor.*

>Copyright (c) 2022 MoriwakiYuuya(yprops)  
>This software is released under the MIT License.  
>https://opensource.org/licenses/mit-license.php

**このスクリプトは、下記を基に機能追加したものです。**  
*This script is based on the below.*

>"Live2D_Preprocess" v1.4  
>https://www.live2d.com/download/ps-script/  
>Copyright (c) 2018 Live2D inc.  
>This software is released under the MIT License.  
>https://opensource.org/licenses/mit-license.php  


---------


## 元の機能
*original script's function*

- レイヤー名に"\*"を含まないレイヤーセットを結合する。  
  *merge layer sets include '\*' in their names.*
- レイヤーマスク、クリッピングマスクの適用。  
  *applying layer masks and clipping masks*
- パス情報の削除。  
  *remove path data*

## 追加機能
*additional functions*

- レイヤー名に"\~"を含むレイヤー、レイヤーグループを削除する。  
  *remove layers / layer sets include '\~' in their names.*
  - 結合されるレイヤーセット内にある"\~"付きレイヤーは削除されません。  
    *in merged layer sets, '\~'layers cannot be removed.*
- ファイル名に指定の接尾辞をつけて別名保存する。  
  *save as other file with name suffix.*  
  - 内部変数の書き換えで、接尾辞の変更と別名保存機能のOFFができます。  
    *rewriting inner vars allows you to modify suffixes and turn off 'save as' function. *


---------


## 更新履歴
- 2022/03/13 v0.1 初出 Released

