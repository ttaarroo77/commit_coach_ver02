// 拡張機能によって注入される属性を事前に削除するスクリプト
// Next.jsのハイドレーションエラーを防ぐために使用

(function() {
  if (typeof document !== 'undefined') {
    // ハイドレーションの前に実行される
    // html要素から拡張機能の属性を削除
    const removeExtensionAttributes = () => {
      // 既知の拡張機能属性のリスト
      const attributesToRemove = [
        'data-redeviation-bs-uid',
        'cz-shortcut-listen',
        'data-styled',
        'data-styled-version'
      ];

      // html要素（documentElement）から属性を削除
      attributesToRemove.forEach(attr => {
        if (document.documentElement.hasAttribute(attr)) {
          document.documentElement.removeAttribute(attr);
        }
      });

      // body要素からも同様に削除
      if (document.body) {
        attributesToRemove.forEach(attr => {
          if (document.body.hasAttribute(attr)) {
            document.body.removeAttribute(attr);
          }
        });
      }
    };

    // DOMContentLoaded前にも実行
    removeExtensionAttributes();

    // DOMContentLoadedイベントでも実行（確実に）
    document.addEventListener('DOMContentLoaded', removeExtensionAttributes);
  }
})();
