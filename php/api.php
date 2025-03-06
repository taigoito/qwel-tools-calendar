<?php
include_once('./functions.php');

$file = '../status.sqlite';
$method = $_GET['method'];

// ステータスの問い合わせ
if ($method === 'fetch') {
  // APIのアクセス許可
  header("Access-Control-Allow-Origin: *");
  
  $result;

  // SQL文発行
  $year = isset($_GET['year']) ? $_GET['year'] : date('Y');
  $month = isset($_GET['month']) ? $_GET['month'] : date('n');
  // 実行
  $result = fetchStatus($file, $year, $month);
  
  // JSON出力
  echo json_encode($result, JSON_UNESCAPED_UNICODE);
  return;

} else {
  // リファラ確認
  //$referer = $_SERVER['HTTP_REFERER'];
  //$url = parse_url($referer);
  //if (!stristr($url['host'], 'qwel.design')) return;

  // ステータスの挿入
  if ($method === 'insert') {
    if (isset($_POST['date']) && isset($_POST['state'])) {
      insertState($file, $_POST['date'], $_POST['state']); 
    }
  
    return;
  }
  
  // ステータスの削除
  if ($method === 'delete') {
    if (isset($_POST['date'])) {
      cleanState($file, $_POST['date']); 
    }
  
    return;
  }
}
