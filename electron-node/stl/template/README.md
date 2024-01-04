# template 到 ODD 的转换

## Invariance/Reachability template

$G\phi$ or $G_{[a,b]}\phi$ or $F\phi$ or $F_{[a,b]}\phi$

e.g.
$$BI:G_{[\tau_{s},T]}(\mu < c)$$

GLOBALLY FROM $\tau$ TO $s$, $\mu$ IS LESS THAN $c$

$$UR:F(x > 0.4)$$

FINALLY, $x$ IS GREATER THAN $0.4$

## Immediate response template

$G(\phi \rightarrow \psi)$

e.g.

$$IR:G(not\_Eclipse=0 \rightarrow sun\_currents=0)$$

GLOBALLY, IF $not\_Eclipse$ IS EQUAL TO $0$, THEN $sun\_currents$ IS EQUAL TO $0$

## Temporal response template

$G(\phi \rightarrow \psi)$

e.g.

$$TR:G(G(Op\_Cmd=Passive)\rightarrow F_{[0,500]}Spd\_Act=0)$$

GLOBALLY, IF GLOBALLY $Op\_Cmd$ IS EQUAL TO $Passive$, THEN FINALLY FROM $0$ TO $500$, $Spd\_Act$ IS EQUAL TO $0$

## Stabilization/Recurrence template

$$ST:F_{[0,14400]}G_{[4590,9953]}(x_{10}>0.325)$$

FINALLY FROM $0$ TO $14400$, ALWAYS FROM $4590$ TO $9953$ $x_{10}$ IS GREATER THAN $0.325$

$$RE:G_{[0,12]}(F_{[0,2]}regionsA \land F_{[0,2]}regionB)$$

GLOBALLY FROM $0$ TO $12$, FINALLY FROM $0$ TO $2$ $regionsA$ AND FINALLY FROM $0$ TO $2$ $regionB$

## 映射规则

$G_{[a,b]}$ -> (NOT) GLOBALLY/ALWAYS (FROM <> TO <>) <>
$F_{[a,b]}$ -> (NOT) FINALLY/EVENTUALLY (FROM <> TO <>) <>
$U_{[a,b]}$ -> <> (NOT) UNTIL (FROM <> TO <>) <>
$\rightarrow$ -> (NOT) IF <> THEN <>
$\land$ -> <> AND <>
$\lor$ -> <> OR <>
$=$ -> <> IS (NOT) EQUAL TO <>
$<$ -> <> IS (NOT) LESS THAN <>
$>$ -> <> IS (NOT) GREATER THAN <>
$\lnot$ -> <> NOT <>

BNF:
```
Y :=  x o y | x (IS NOT) o y
SP := Y | Y AND Y | Y OR Y (atom)

TP' := FINALLY/EVENTUALLY/GLOBALLY/ALWAYS (FROM <> TO <>) Y | Y UNTIL (FROM <> TO <>) Y
TP := TP' | NOT TP'

IM := IF Y THEN Y (atom)

NTP := FINALLY/EVENTUALLY GLOBALLY/ALWAYS Y | GLOBALLY/ALWAYS FINALLY/EVENTUALLY Y

P := SP | TP

I := | GLOBALLY SP | FINALLY SP  (𝐼𝑛𝑣𝑎𝑟𝑖𝑎𝑛𝑐𝑒/𝑅𝑒𝑎𝑐ℎ𝑎𝑏𝑖𝑙𝑖𝑡𝑦)
     | GLOBALLY IF SP THEN SP  (𝐼𝑚𝑚𝑒𝑑𝑖𝑎𝑡𝑒 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒)
     | GLOBALLY IF P THEN TP  (𝑇𝑒𝑚𝑝𝑜𝑟𝑎𝑙 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒)
     | GLOBALLY IF P THEN NTP (𝑆𝑡𝑎𝑏𝑖𝑙𝑖𝑧𝑎𝑡𝑖𝑜𝑛/𝑅𝑒𝑐𝑢𝑟𝑟𝑒𝑛𝑐𝑒)


```

### 二义性问题

e.g.
```
GLOBALLY Y AND Y
FINALLY Y OR Y
GLOBALLY IF Y AND Y THEN Y AND Y
GLOBALLY IF NOT FINALLY Y THEN Y NOT UNTIL Y
GLOBALLY IF NOT FINALLY Y THEN FINALLY GLOBALLY Y
```

GLOBALLY A AND B AND GLOBALLY C AND D AND E

$G(A \land B) \land G(C \land D) \land E$

默认结合采用以下优先级：
(<>)(=, <, >)($\lnot$)($G$, $F$)($\land$, $\lor$)($\rightarrow$, $U$)


$G[]F[]U[]$ 默认结合前后的atom原子，