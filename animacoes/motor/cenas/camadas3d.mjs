// A cor-base conserva máscara, desenho, roupa e rosto. Só os dois retângulos
// usados para iluminar o personagem no modo 2D deixam de ser acumulados no 3D.
export function corBaseDoPersonagem(svg) {
  return svg.replace(/<rect\b[^>]*fill="url\(#(?:luzP|bordaP)\)"[^>]*\/>/g, '');
}
