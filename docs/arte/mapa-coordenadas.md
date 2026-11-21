# Mapa ilustrado de la ruta · coordenadas

**Responsable:** ilustrador · **Fecha:** 2026-11-20 · **Imagen:** `site/landing/assets/art/mapa-2720.webp` (y `-1600`, `-960`). El original es `mapa.png`, de 2720 × 1536 px (16:9), en el scratchpad (`art-raw/mapa.png`).

Todas las medidas se tomaron **sobre la imagen**, con una cuadrícula de 100 px y muestreando el color del río. Para el río usé la línea central detectada por brillo. Los porcentajes son del ancho (2720) y del alto (1536): sirven igual para las tres versiones WebP, porque las tres tienen la misma proporción.

Para un `viewBox="0 0 2720 1536"` encima de la imagen, usa los píxeles tal cual. Para posicionar en CSS, usa los porcentajes.

Comprobación: `mapa-ruta-check.png` en el scratchpad, con las ciudades en dorado y cada tramo de un color.

## Ciudades (centro de cada viñeta)

| Ciudad | x (px) | y (px) | x (% ancho) | y (% alto) | Qué hay ahí |
| --- | --- | --- | --- | --- | --- |
| Medellín | 755 | 885 | 27,8 % | 57,6 % | Centro del valle de ladrillo, junto a la catedral; el Metrocable sube a la izquierda |
| Bogotá | 2130 | 1300 | 78,3 % | 84,6 % | Centro del caserío; el santuario de Monserrate está arriba, en (2120, 1160) = 77,9 % · 75,5 % |
| Cartagena | 340 | 450 | 12,5 % | 29,3 % | Centro del recinto amurallado con las cúpulas |
| Santa Marta (la bahía) | 1560 | 688 | 57,4 % | 44,8 % | Playa del fondo de la bahía, al oeste de la cala (no hay viñeta de ciudad: es la bahía) |
| Tayrona (la cala) | 1760 | 615 | 64,7 % | 40,0 % | Centro del islote de rocas redondas con las dos palmeras |

Orientación del dibujo: el norte queda arriba (el mar al fondo) y la vista es de pájaro inclinada. La costa baja en diagonal desde Cartagena, arriba a la izquierda, hasta la desembocadura del Magdalena y la bahía, en el centro a la derecha. La Sierra Nevada queda arriba a la derecha.

**Nota sobre Santa Marta y Tayrona:** el modelo pintó una sola bahía con una cala de rocas y palmeras, sin ciudad. Por eso Santa Marta es un punto en la playa del fondo de la bahía, y Tayrona es la cala, unos 210 px al este y un poco al norte. Así se respeta el orden oeste → este de la costa real. Si se quiere separarlos más, hay otro grupo de rocas redondas en la punta norte de la bahía, al pie de la Sierra, en (1920, 425) = 70,6 % · 27,7 %, que también puede leerse como Tayrona.

## Trazado de la ruta (puntos intermedios)

Los puntos van en el orden del viaje. Con una curva suave que pase por ellos (por ejemplo, Catmull-Rom o `d3.curveCatmullRom`), la línea sigue los valles, el río y la playa pintados.

### Medellín → Bogotá
Sale al este de Medellín, cruza la cordillera Central (como la vía real que baja a Puerto Triunfo), cruza el Magdalena hacia su curva sur y sube por las laderas de la cordillera Oriental hasta Bogotá. Llega a Bogotá desde el oeste.

| # | x (px) | y (px) | x (% ancho) | y (% alto) |
| --- | --- | --- | --- | --- |
| inicio (Medellín) | 755 | 885 | 27,8 % | 57,6 % |
| 1 | 900 | 880 | 33,1 % | 57,3 % |
| 2 | 1060 | 910 | 39,0 % | 59,2 % |
| 3 | 1220 | 980 | 44,9 % | 63,8 % |
| 4 | 1380 | 1060 | 50,7 % | 69,0 % |
| 5 | 1528 | 1125 | 56,2 % | 73,2 % |
| 6 | 1700 | 1200 | 62,5 % | 78,1 % |
| 7 | 1860 | 1270 | 68,4 % | 82,7 % |
| 8 | 2000 | 1310 | 73,5 % | 85,3 % |
| fin (Bogotá) | 2130 | 1300 | 78,3 % | 84,6 % |

### Bogotá → Cartagena
Baja de Bogotá hacia el noroeste, se une al Magdalena y sube por el río hasta cerca de la desembocadura; luego cruza las llanuras del norte, por encima de la punta de la cordillera Central, hasta Cartagena. Va por dentro, separada de la costa, para no montarse sobre el tramo siguiente.

| # | x (px) | y (px) | x (% ancho) | y (% alto) |
| --- | --- | --- | --- | --- |
| inicio (Bogotá) | 2130 | 1300 | 78,3 % | 84,6 % |
| 1 | 1990 | 1195 | 73,2 % | 77,8 % |
| 2 | 1780 | 1050 | 65,4 % | 68,4 % |
| 3 | 1640 | 990 | 60,3 % | 64,5 % |
| 4 | 1550 | 905 | 57,0 % | 58,9 % |
| 5 | 1430 | 800 | 52,6 % | 52,1 % |
| 6 | 1320 | 725 | 48,5 % | 47,2 % |
| 7 | 1050 | 700 | 38,6 % | 45,6 % |
| 8 | 700 | 615 | 25,7 % | 40,0 % |
| fin (Cartagena) | 340 | 450 | 12,5 % | 29,3 % |

### Cartagena → Santa Marta
Por la playa, siguiendo la orilla pintada, y pasa por la desembocadura del Magdalena.

| # | x (px) | y (px) | x (% ancho) | y (% alto) |
| --- | --- | --- | --- | --- |
| inicio (Cartagena) | 340 | 450 | 12,5 % | 29,3 % |
| 1 | 520 | 462 | 19,1 % | 30,1 % |
| 2 | 760 | 562 | 27,9 % | 36,6 % |
| 3 | 1000 | 638 | 36,8 % | 41,5 % |
| 4 | 1200 | 676 | 44,1 % | 44,0 % |
| 5 | 1330 | 690 | 48,9 % | 44,9 % |
| 6 | 1450 | 692 | 53,3 % | 45,1 % |
| fin (Santa Marta (la bahía)) | 1560 | 688 | 57,4 % | 44,8 % |

### Santa Marta → Tayrona
Tramo corto por la playa de la bahía hasta la cala de rocas y palmeras.

| # | x (px) | y (px) | x (% ancho) | y (% alto) |
| --- | --- | --- | --- | --- |
| inicio (Santa Marta (la bahía)) | 1560 | 688 | 57,4 % | 44,8 % |
| 1 | 1620 | 690 | 59,6 % | 44,9 % |
| 2 | 1690 | 675 | 62,1 % | 43,9 % |
| 3 | 1730 | 645 | 63,6 % | 42,0 % |
| fin (Tayrona (la cala)) | 1760 | 615 | 64,7 % | 40,0 % |

## Referencia: línea central del Magdalena

Por si el diseñador quiere animar el río o ajustar el tramo Bogotá → Cartagena. Va de norte (desembocadura) a sur.

| x (px) | y (px) | x (% ancho) | y (% alto) |
| --- | --- | --- | --- |
| 1320 | 700 | 48,5 % | 45,6 % |
| 1322 | 720 | 48,6 % | 46,9 % |
| 1363 | 750 | 50,1 % | 48,8 % |
| 1426 | 795 | 52,4 % | 51,8 % |
| 1471 | 840 | 54,1 % | 54,7 % |
| 1531 | 870 | 56,3 % | 56,6 % |
| 1553 | 915 | 57,1 % | 59,6 % |
| 1605 | 960 | 59,0 % | 62,5 % |
| 1644 | 990 | 60,4 % | 64,5 % |
| 1633 | 1020 | 60,0 % | 66,4 % |
| 1590 | 1050 | 58,5 % | 68,4 % |
| 1550 | 1080 | 57,0 % | 70,3 % |
| 1528 | 1125 | 56,2 % | 73,2 % |
| 1552 | 1170 | 57,1 % | 76,2 % |
| 1580 | 1215 | 58,1 % | 79,1 % |
| 1555 | 1290 | 57,2 % | 84,0 % |
