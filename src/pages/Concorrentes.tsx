<section class="frzcmp-section">
  <style>
    .frzcmp-section{
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
      background:#fff;
      padding:80px 40px;
      color:#222;
    }

    .frzcmp-wrap{
      max-width:1200px;
      margin:0;
    }

    .frzcmp-title{
      font-size:36px;
      font-weight:600;
      margin-bottom:6px;
      color:#111;
    }

    .frzcmp-sub{
      font-size:15px;
      color:#6b7280;
      margin-bottom:30px;
    }

    .frzcmp-card{
      background:#fff;
      border-radius:18px;
      overflow:hidden;
      border:1px solid #eee;
      box-shadow:0 12px 40px rgba(0,0,0,.05);
    }

    .frzcmp-grid{
      display:grid;
      grid-template-columns:140px repeat(4,1fr);
    }

    .frzcmp-cell{
      padding:18px;
      border-bottom:1px solid #eee;
      border-right:1px solid #eee;
      display:flex;
      align-items:center;
      justify-content:center;
      text-align:center;
      font-size:15px;
      background:#fff;
    }

    .frzcmp-cell:nth-child(5n){
      border-right:none;
    }

    .frzcmp-head{
      min-height:90px;
      background:#fff;
    }

    .frzcmp-label{
      background:#fafafa;
      justify-content:flex-start;
      text-align:left;
      color:#666;
      font-weight:500;
    }

    .frzcmp-logo{
      max-height:26px;
    }

    .frzcmp-logo-trinks{
      max-height:32px;
    }

    .frzcmp-badge{
      margin-top:6px;
      font-size:10px;
      background:#fee2e2;
      color:#ef4444;
      padding:3px 7px;
      border-radius:999px;
    }

    .frzcmp-old{
      text-decoration:line-through;
      color:#9ca3af;
      font-size:13px;
      display:block;
    }

    .frzcmp-new{
      font-size:16px;
      font-weight:600;
      color:#ef4444;
    }

    .frzcmp-plus{
      background:#f9fafb;
    }

    .frzcmp-frizzar{
      background:#fff7f7;
    }

    .frzcmp-muted{
      color:#9ca3af;
      font-size:13px;
    }

    @media(max-width:900px){
      .frzcmp-grid{min-width:900px;}
      .frzcmp-card{overflow-x:auto;}
      .frzcmp-section{padding:60px 20px;}
    }
  </style>

  <div class="frzcmp-wrap">
    <h2 class="frzcmp-title">Compare antes de decidir</h2>
    <p class="frzcmp-sub">Veja quanto você paga conforme sua equipe cresce.</p>

    <div class="frzcmp-card">
      <div class="frzcmp-grid">

        <!-- HEADER -->
        <div class="frzcmp-cell frzcmp-head frzcmp-label">Agendas</div>

        <!-- FRIZZAR+ (ESQUERDA) -->
        <div class="frzcmp-cell frzcmp-head frzcmp-plus">
          <div>
            Frizzar+
            <div class="frzcmp-badge">20% OFF</div>
          </div>
        </div>

        <!-- FRIZZAR -->
        <div class="frzcmp-cell frzcmp-head">
          <img class="frzcmp-logo" src="https://a.frizzar.com.br/wp-content/uploads/2025/04/LNSPB-e1655256051516.png">
        </div>

        <!-- TRINKS -->
        <div class="frzcmp-cell frzcmp-head">
          <img class="frzcmp-logo frzcmp-logo-trinks" src="https://djnn6j6gf59xn.cloudfront.net/content/img/novo_portal/logo-topo-rebranding.png">
        </div>

        <!-- AVEC -->
        <div class="frzcmp-cell frzcmp-head">
          <img class="frzcmp-logo" src="https://cdn.prod.website-files.com/6151e81f5d43e8748b3808c6/6151fb367006fe41eaa186e7_Logo%20Avec.svg">
        </div>

        <!-- LINHAS -->

        <div class="frzcmp-cell frzcmp-label">1</div>
        <div class="frzcmp-cell frzcmp-plus"><span class="frzcmp-new">R$57</span></div>
        <div class="frzcmp-cell frzcmp-frizzar"><span class="frzcmp-old">R$72</span></div>
        <div class="frzcmp-cell">~R$85</div>
        <div class="frzcmp-cell">R$99</div>

        <div class="frzcmp-cell frzcmp-label">2</div>
        <div class="frzcmp-cell frzcmp-plus"><span class="frzcmp-new">R$71</span></div>
        <div class="frzcmp-cell frzcmp-frizzar"><span class="frzcmp-old">R$89</span></div>
        <div class="frzcmp-cell">~R$130</div>
        <div class="frzcmp-cell">R$163</div>

        <div class="frzcmp-cell frzcmp-label">3 a 6</div>
        <div class="frzcmp-cell frzcmp-plus"><span class="frzcmp-new">R$91</span></div>
        <div class="frzcmp-cell frzcmp-frizzar"><span class="frzcmp-old">R$114</span></div>
        <div class="frzcmp-cell">~R$210</div>
        <div class="frzcmp-cell">R$286</div>

        <div class="frzcmp-cell frzcmp-label">7 a 12</div>
        <div class="frzcmp-cell frzcmp-plus"><span class="frzcmp-new">R$137</span></div>
        <div class="frzcmp-cell frzcmp-frizzar"><span class="frzcmp-old">R$172</span></div>
        <div class="frzcmp-cell">~R$310</div>
        <div class="frzcmp-cell">R$397</div>

        <div class="frzcmp-cell frzcmp-label">13 a 20</div>
        <div class="frzcmp-cell frzcmp-plus"><span class="frzcmp-new">R$177</span></div>
        <div class="frzcmp-cell frzcmp-frizzar"><span class="frzcmp-old">R$221</span></div>
        <div class="frzcmp-cell">~R$420</div>
        <div class="frzcmp-cell">R$397+</div>

      </div>
    </div>
  </div>
</section>