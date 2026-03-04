import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Layout, Menu, List, Card, Avatar, Badge, Tag, Button, Input,
  Select, Statistic, Row, Col, Typography, Space, Drawer, Form,
  Tabs, Alert, Spin, Empty, Modal, Divider, Progress,
  Timeline, Tooltip, ConfigProvider, theme as antTheme,
  notification, Table, DatePicker, Segmented,
} from 'antd';
import {
  DashboardOutlined, BookOutlined, UserOutlined, MedicineBoxOutlined,
  DollarOutlined, BellOutlined, SearchOutlined, SettingOutlined,
  TeamOutlined, FileTextOutlined, CalendarOutlined, CheckCircleOutlined,
  ClockCircleOutlined, ExclamationCircleOutlined, RiseOutlined,
  HeartOutlined, TrophyOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  PlusOutlined, FilterOutlined, ReloadOutlined, LogoutOutlined,
  BarChartOutlined, ApartmentOutlined, SafetyOutlined, StarOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { defaultAlgorithm, darkAlgorithm } = antTheme;

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.iepi.edu.br/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('iepi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) localStorage.removeItem('iepi_token');
    return Promise.reject(err);
  }
);

const mockCursos = [
  { id: 1, nome: 'Medicina', tipo: 'Graduação', turno: 'Integral', vagas: 120, matriculados: 118, status: 'ativo', duracao: '12 semestres', coordenador: 'Prof. Dr. Henrique Assunção', carga: 8640, reconhecido: true },
  { id: 2, nome: 'Enfermagem', tipo: 'Graduação', turno: 'Integral', vagas: 100, matriculados: 97, status: 'ativo', duracao: '10 semestres', coordenador: 'Profa. Dra. Ana Lima', carga: 4000, reconhecido: true },
  { id: 3, nome: 'Fisioterapia', tipo: 'Graduação', turno: 'Matutino', vagas: 60, matriculados: 58, status: 'ativo', duracao: '10 semestres', coordenador: 'Profa. Dra. Carla Vaz', carga: 3600, reconhecido: true },
  { id: 4, nome: 'Residência em Clínica Médica', tipo: 'Residência', turno: 'Integral', vagas: 20, matriculados: 20, status: 'ativo', duracao: '4 semestres', coordenador: 'Prof. Dr. Marcos Torres', carga: 5760, reconhecido: true },
  { id: 5, nome: 'Residência em Cirurgia Geral', tipo: 'Residência', turno: 'Integral', vagas: 12, matriculados: 12, status: 'ativo', duracao: '4 semestres', coordenador: 'Prof. Dr. Eduardo Freitas', carga: 5760, reconhecido: true },
  { id: 6, nome: 'Pós-graduação em Gestão Hospitalar', tipo: 'Pós-graduação', turno: 'Noturno', vagas: 40, matriculados: 38, status: 'ativo', duracao: '4 semestres', coordenador: 'Profa. Dra. Renata Souza', carga: 480, reconhecido: true },
  { id: 7, nome: 'Nutrição Clínica e Hospitalar', tipo: 'Graduação', turno: 'Matutino', vagas: 50, matriculados: 44, status: 'ativo', duracao: '8 semestres', coordenador: 'Profa. Dra. Juliana Neves', carga: 3200, reconhecido: true },
  { id: 8, nome: 'Psicologia', tipo: 'Graduação', turno: 'Vespertino', vagas: 60, matriculados: 55, status: 'ativo', duracao: '10 semestres', coordenador: 'Profa. Dra. Beatriz Alves', carga: 4000, reconhecido: true },
];

const mockAlunos = [
  { id: 1, nome: 'Lucas Ferreira', curso: 'Medicina', semestre: 6, cr: 8.7, status: 'regular', nascimento: '2001-03-10', matricula: '2022001', estagioHospital: true, bolsa: 'PROUNI' },
  { id: 2, nome: 'Isabela Carvalho', curso: 'Enfermagem', semestre: 4, cr: 9.1, status: 'regular', nascimento: '2002-07-22', matricula: '2023002', estagioHospital: true, bolsa: null },
  { id: 3, nome: 'Rafael Mendes', curso: 'Fisioterapia', semestre: 8, cr: 7.4, status: 'regular', nascimento: '2000-11-05', matricula: '2021003', estagioHospital: false, bolsa: 'FIES' },
  { id: 4, nome: 'Mariana Oliveira', curso: 'Medicina', semestre: 10, cr: 9.4, status: 'regular', nascimento: '1999-01-30', matricula: '2020004', estagioHospital: true, bolsa: null },
  { id: 5, nome: 'Pedro Almeida', curso: 'Psicologia', semestre: 3, cr: 6.8, status: 'alerta', nascimento: '2003-08-14', matricula: '2024005', estagioHospital: false, bolsa: null },
  { id: 6, nome: 'Ana Beatriz Silva', curso: 'Nutrição Clínica e Hospitalar', semestre: 6, cr: 8.3, status: 'regular', nascimento: '2001-05-19', matricula: '2022006', estagioHospital: true, bolsa: 'PROUNI' },
  { id: 7, nome: 'Thiago Ramos', curso: 'Medicina', semestre: 2, cr: 7.9, status: 'regular', nascimento: '2004-12-03', matricula: '2025007', estagioHospital: false, bolsa: null },
  { id: 8, nome: 'Camila Duarte', curso: 'Residência em Clínica Médica', semestre: 2, cr: 9.6, status: 'regular', nascimento: '1997-09-26', matricula: '2024008', estagioHospital: true, bolsa: 'Bolsa CNRM' },
  { id: 9, nome: 'Guilherme Costa', curso: 'Pós-graduação em Gestão Hospitalar', semestre: 3, cr: 8.0, status: 'regular', nascimento: '1990-04-11', matricula: '2025009', estagioHospital: false, bolsa: null },
  { id: 10, nome: 'Larissa Rocha', curso: 'Enfermagem', semestre: 7, cr: 5.9, status: 'alerta', nascimento: '2000-06-28', matricula: '2021010', estagioHospital: true, bolsa: 'FIES' },
];

const mockInternamentos = [
  { id: 1, setor: 'UTI Adulto', leitos: 30, ocupados: 28, residentesAtivos: 8, coordenador: 'Dr. Marcos Torres', especialidade: 'Terapia Intensiva', status: 'crítico' },
  { id: 2, setor: 'Clínica Médica', leitos: 60, ocupados: 52, residentesAtivos: 12, coordenador: 'Dra. Renata Assis', especialidade: 'Clínica Geral', status: 'normal' },
  { id: 3, setor: 'Centro Cirúrgico', leitos: 10, ocupados: 7, residentesAtivos: 6, coordenador: 'Dr. Eduardo Freitas', especialidade: 'Cirurgia Geral', status: 'normal' },
  { id: 4, setor: 'Pediatria', leitos: 40, ocupados: 22, residentesAtivos: 5, coordenador: 'Dra. Sônia Moraes', especialidade: 'Pediatria', status: 'normal' },
  { id: 5, setor: 'Maternidade', leitos: 35, ocupados: 30, residentesAtivos: 4, coordenador: 'Dra. Fernanda Luz', especialidade: 'Obstetrícia', status: 'alto' },
  { id: 6, setor: 'Pronto-Socorro', leitos: 20, ocupados: 19, residentesAtivos: 10, coordenador: 'Dr. Alexandre Mota', especialidade: 'Emergência', status: 'crítico' },
];

const mockFinanceiro = [
  { id: 1, descricao: 'Mensalidades — Março/2026', tipo: 'receita', valor: 1842500, status: 'recebido', data: '2026-03-05', categoria: 'Ensino' },
  { id: 2, descricao: 'Convênio SUS — Procedimentos Fev/2026', tipo: 'receita', valor: 680000, status: 'recebido', data: '2026-03-01', categoria: 'Hospital' },
  { id: 3, descricao: 'Folha de Pagamento — Mar/2026', tipo: 'despesa', valor: 1120000, status: 'pago', data: '2026-03-05', categoria: 'RH' },
  { id: 4, descricao: 'Insumos e Medicamentos — Mar/2026', tipo: 'despesa', valor: 245000, status: 'pendente', data: '2026-03-15', categoria: 'Hospital' },
  { id: 5, descricao: 'Repasse PROUNI — Mar/2026', tipo: 'receita', valor: 312000, status: 'a receber', data: '2026-03-20', categoria: 'Bolsas' },
  { id: 6, descricao: 'Manutenção Predial — T1/2026', tipo: 'despesa', valor: 89000, status: 'pago', data: '2026-02-28', categoria: 'Infraestrutura' },
  { id: 7, descricao: 'Convênio Planos de Saúde — Fev/2026', tipo: 'receita', valor: 430000, status: 'a receber', data: '2026-03-25', categoria: 'Hospital' },
];

const mockNotificacoes = [
  { id: 1, tipo: 'alerta', titulo: 'UTI Adulto acima de 90% de ocupação', descricao: 'Capacidade operacional crítica — acionar protocolo de contingência.', hora: '08:14', lida: false },
  { id: 2, tipo: 'info', titulo: 'Matrículas abertas — 2º semestre 2026', descricao: 'Sistema de inscrição disponível até 30/04/2026.', hora: '07:30', lida: false },
  { id: 3, tipo: 'sucesso', titulo: 'Relatório INEP enviado com sucesso', descricao: 'Censo da Educação Superior 2025 protocolado.', hora: '06:55', lida: true },
  { id: 4, tipo: 'alerta', titulo: '2 alunos com CR abaixo de 6.0', descricao: 'Pedro Almeida e Larissa Rocha necessitam de acompanhamento pedagógico.', hora: 'Ontem', lida: false },
  { id: 5, tipo: 'info', titulo: 'Novo convênio assinado — Unimed Regional', descricao: 'Início de atendimentos a partir de 15/03/2026.', hora: 'Ontem', lida: true },
];

const fetchCursos = createAsyncThunk('cursos/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return mockCursos;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Erro ao carregar cursos');
  }
});

const cursosSlice = createSlice({
  name: 'cursos',
  initialState: { lista: [], loading: false, erro: null, filtro: 'todos' },
  reducers: {
    setFiltro: (state, action) => { state.filtro = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCursos.pending, (state) => { state.loading = true; state.erro = null; })
      .addCase(fetchCursos.fulfilled, (state, action) => { state.loading = false; state.lista = action.payload; })
      .addCase(fetchCursos.rejected, (state, action) => { state.loading = false; state.erro = action.payload; });
  },
});

const fetchAlunos = createAsyncThunk('alunos/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return mockAlunos;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Erro ao carregar alunos');
  }
});

const alunosSlice = createSlice({
  name: 'alunos',
  initialState: { lista: [], loading: false, erro: null, busca: '' },
  reducers: {
    setBusca: (state, action) => { state.busca = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlunos.pending, (state) => { state.loading = true; })
      .addCase(fetchAlunos.fulfilled, (state, action) => { state.loading = false; state.lista = action.payload; })
      .addCase(fetchAlunos.rejected, (state, action) => { state.loading = false; state.erro = action.payload; });
  },
});

const fetchInternamentos = createAsyncThunk('hospital/fetchInternamentos', async (_, { rejectWithValue }) => {
  try {
    return mockInternamentos;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Erro ao carregar setores');
  }
});

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState: { setores: [], loading: false, erro: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInternamentos.pending, (state) => { state.loading = true; })
      .addCase(fetchInternamentos.fulfilled, (state, action) => { state.loading = false; state.setores = action.payload; })
      .addCase(fetchInternamentos.rejected, (state, action) => { state.loading = false; state.erro = action.payload; });
  },
});

const fetchFinanceiro = createAsyncThunk('financeiro/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return mockFinanceiro;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Erro ao carregar financeiro');
  }
});

const financeiroSlice = createSlice({
  name: 'financeiro',
  initialState: { lancamentos: [], loading: false, erro: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinanceiro.pending, (state) => { state.loading = true; })
      .addCase(fetchFinanceiro.fulfilled, (state, action) => { state.loading = false; state.lancamentos = action.payload; })
      .addCase(fetchFinanceiro.rejected, (state, action) => { state.loading = false; state.erro = action.payload; });
  },
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: { collapsed: false, darkMode: true, moduloAtivo: 'dashboard', notificacoesVistas: false },
  reducers: {
    toggleSider: (state) => { state.collapsed = !state.collapsed; },
    toggleDark: (state) => { state.darkMode = !state.darkMode; },
    setModulo: (state, action) => { state.moduloAtivo = action.payload; },
    marcarNotificacoes: (state) => { state.notificacoesVistas = true; },
  },
});

const store = configureStore({
  reducer: {
    cursos: cursosSlice.reducer,
    alunos: alunosSlice.reducer,
    hospital: hospitalSlice.reducer,
    financeiro: financeiroSlice.reducer,
    ui: uiSlice.reducer,
  },
});

const { toggleSider, toggleDark, setModulo, marcarNotificacoes } = uiSlice.actions;
const { setFiltro } = cursosSlice.actions;
const { setBusca } = alunosSlice.actions;

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v / 100);

function KpiCard({ titulo, valor, prefixo, sufixo, cor, icone, tendencia }) {
  return (
    <Card
      size="small"
      style={{ borderRadius: 16, borderLeft: `4px solid ${cor}`, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' }}
      bodyStyle={{ padding: '20px 24px' }}
    >
      <Space direction="vertical" size={0} style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{titulo}</Text>
          <span style={{ color: cor, fontSize: 20 }}>{icone}</span>
        </Space>
        <Statistic
          value={valor}
          prefix={prefixo}
          suffix={sufixo}
          valueStyle={{ fontSize: 28, fontWeight: 700, color: cor }}
        />
        {tendencia && <Text style={{ fontSize: 11, color: '#52c41a' }}><RiseOutlined /> {tendencia}</Text>}
      </Space>
    </Card>
  );
}

function ModuloDashboard() {
  const dispatch = useDispatch();
  const { lista: cursos } = useSelector((s) => s.cursos);
  const { lista: alunos } = useSelector((s) => s.alunos);
  const { setores } = useSelector((s) => s.hospital);
  const { lancamentos } = useSelector((s) => s.financeiro);

  const totalAlunos = cursos.reduce((a, c) => a + c.matriculados, 0);
  const totalLeitos = setores.reduce((a, s) => a + s.leitos, 0);
  const leitosOcupados = setores.reduce((a, s) => a + s.ocupados, 0);
  const receitas = lancamentos.filter((l) => l.tipo === 'receita').reduce((a, l) => a + l.valor, 0);
  const despesas = lancamentos.filter((l) => l.tipo === 'despesa').reduce((a, l) => a + l.valor, 0);
  const residentesTotal = setores.reduce((a, s) => a + s.residentesAtivos, 0);
  const setoresCriticos = setores.filter((s) => s.status === 'crítico').length;

  useEffect(() => {
    dispatch(fetchCursos());
    dispatch(fetchAlunos());
    dispatch(fetchInternamentos());
    dispatch(fetchFinanceiro());
  }, [dispatch]);

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard titulo="Alunos Matriculados" valor={totalAlunos} cor="#6C1ED9" icone={<TeamOutlined />} tendencia="+4.2% vs. 2025" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard titulo="Cursos Ativos" valor={cursos.length} cor="#0280a0" icone={<BookOutlined />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard titulo="Ocupação Hospitalar" valor={totalLeitos ? Math.round((leitosOcupados / totalLeitos) * 100) : 0} sufixo="%" cor={setoresCriticos > 1 ? '#cf1322' : '#d96704'} icone={<MedicineBoxOutlined />} tendencia={`${residentesTotal} residentes em campo`} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard titulo="Saldo Mensal" valor={fmt((receitas - despesas))} cor="#52c41a" icone={<DollarOutlined />} tendencia="Março/2026" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title={<Space><HeartOutlined style={{ color: '#cf1322' }} /><Text strong>Setores do Hospital-Escola</Text></Space>} style={{ borderRadius: 16 }} bodyStyle={{ padding: 0 }}>
            <List
              dataSource={setores}
              renderItem={(setor) => {
                const pct = Math.round((setor.ocupados / setor.leitos) * 100);
                const cor = pct >= 95 ? '#cf1322' : pct >= 80 ? '#fa8c16' : '#52c41a';
                return (
                  <List.Item style={{ padding: '14px 20px' }}>
                    <List.Item.Meta
                      avatar={<Avatar size={40} style={{ background: cor + '22', color: cor, fontWeight: 700 }}>{setor.ocupados}</Avatar>}
                      title={<Space><Text strong>{setor.setor}</Text><Tag color={pct >= 95 ? 'error' : pct >= 80 ? 'warning' : 'success'} style={{ fontSize: 10 }}>{setor.status.toUpperCase()}</Tag></Space>}
                      description={<Text type="secondary" style={{ fontSize: 12 }}>{setor.especialidade} · {setor.residentesAtivos} residentes</Text>}
                    />
                    <Space direction="vertical" align="end" size={2} style={{ minWidth: 120 }}>
                      <Text style={{ fontSize: 13, color: cor, fontWeight: 600 }}>{pct}%</Text>
                      <Progress percent={pct} size="small" strokeColor={cor} showInfo={false} style={{ width: 110 }} />
                      <Text type="secondary" style={{ fontSize: 11 }}>{setor.ocupados}/{setor.leitos} leitos</Text>
                    </Space>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title={<Space><BellOutlined style={{ color: '#6C1ED9' }} /><Text strong>Notificações</Text></Space>} style={{ borderRadius: 16 }} bodyStyle={{ padding: 0 }}>
            <List
              dataSource={mockNotificacoes}
              renderItem={(n) => {
                const iconMap = {
                  alerta: <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />,
                  info: <ClockCircleOutlined style={{ color: '#0280a0' }} />,
                  sucesso: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                };
                return (
                  <List.Item style={{ padding: '12px 20px', opacity: n.lida ? 0.55 : 1 }}>
                    <List.Item.Meta
                      avatar={<Avatar size={32} icon={iconMap[n.tipo]} style={{ background: 'transparent' }} />}
                      title={<Text style={{ fontSize: 13, fontWeight: n.lida ? 400 : 600 }}>{n.titulo}</Text>}
                      description={<Space direction="vertical" size={0}><Text type="secondary" style={{ fontSize: 11 }}>{n.descricao}</Text><Text type="secondary" style={{ fontSize: 10 }}>{n.hora}</Text></Space>}
                    />
                    {!n.lida && <Badge status="processing" color="#6C1ED9" />}
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>

      <Card title={<Space><TrophyOutlined style={{ color: '#d96704' }} /><Text strong>Destaques Acadêmicos — Alunos com Maior CR</Text></Space>} style={{ borderRadius: 16 }} bodyStyle={{ padding: 0 }}>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
          dataSource={[...alunos].sort((a, b) => b.cr - a.cr).slice(0, 5)}
          style={{ padding: '16px 20px' }}
          renderItem={(aluno) => (
            <List.Item>
              <Card size="small" style={{ textAlign: 'center', borderRadius: 12, border: '1px solid rgba(108,30,217,0.3)' }}>
                <Avatar size={48} style={{ background: '#6C1ED9', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                  {aluno.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </Avatar>
                <div><Text strong style={{ fontSize: 13 }}>{aluno.nome.split(' ')[0]} {aluno.nome.split(' ').slice(-1)}</Text></div>
                <div><Text type="secondary" style={{ fontSize: 11 }}>{aluno.curso}</Text></div>
                <Tag color="purple" style={{ marginTop: 6 }}>CR {aluno.cr.toFixed(1)}</Tag>
                {aluno.bolsa && <div><Tag color="gold" style={{ fontSize: 10, marginTop: 4 }}>{aluno.bolsa}</Tag></div>}
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}

function ModuloCursos() {
  const dispatch = useDispatch();
  const { lista, loading, filtro } = useSelector((s) => s.cursos);

  useEffect(() => { dispatch(fetchCursos()); }, [dispatch]);

  const cursosFiltrados = filtro === 'todos' ? lista : lista.filter((c) => c.tipo === filtro);

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle" wrap>
        <Col><Title level={4} style={{ margin: 0 }}>Cursos e Programas</Title></Col>
        <Col>
          <Space wrap>
            <Segmented
              options={['todos', 'Graduação', 'Pós-graduação', 'Residência']}
              value={filtro}
              onChange={(v) => dispatch(setFiltro(v))}
            />
            <Button icon={<ReloadOutlined />} onClick={() => dispatch(fetchCursos())}>Atualizar</Button>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#6C1ED9', borderColor: '#6C1ED9' }}>Novo Curso</Button>
          </Space>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
          dataSource={cursosFiltrados}
          locale={{ emptyText: <Empty description="Nenhum curso encontrado" /> }}
          renderItem={(curso) => {
            const pct = Math.round((curso.matriculados / curso.vagas) * 100);
            const tipoColor = { Graduação: 'purple', 'Pós-graduação': 'blue', Residência: 'red' };
            return (
              <List.Item>
                <Card
                  hoverable
                  style={{ borderRadius: 16 }}
                  actions={[
                    <Tooltip title="Ver alunos"><TeamOutlined key="alunos" /></Tooltip>,
                    <Tooltip title="Grade curricular"><FileTextOutlined key="grade" /></Tooltip>,
                    <Tooltip title="Relatórios"><BarChartOutlined key="relatorio" /></Tooltip>,
                  ]}
                >
                  <Card.Meta
                    avatar={<Avatar size={48} style={{ background: tipoColor[curso.tipo] === 'purple' ? '#6C1ED9' : tipoColor[curso.tipo] === 'blue' ? '#0280a0' : '#cf1322', fontSize: 22 }}><BookOutlined /></Avatar>}
                    title={<Space direction="vertical" size={2}><Text strong>{curso.nome}</Text><Tag color={tipoColor[curso.tipo]}>{curso.tipo}</Tag></Space>}
                    description={<Text type="secondary" style={{ fontSize: 12 }}>{curso.coordenador}</Text>}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <Row gutter={8}>
                    <Col span={12}><Text type="secondary" style={{ fontSize: 11 }}>TURNO</Text><br /><Text style={{ fontSize: 13 }}>{curso.turno}</Text></Col>
                    <Col span={12}><Text type="secondary" style={{ fontSize: 11 }}>DURAÇÃO</Text><br /><Text style={{ fontSize: 13 }}>{curso.duracao}</Text></Col>
                  </Row>
                  <div style={{ marginTop: 12 }}>
                    <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                      <Text style={{ fontSize: 12 }}>Ocupação de vagas</Text>
                      <Text style={{ fontSize: 12, fontWeight: 600 }}>{curso.matriculados}/{curso.vagas}</Text>
                    </Space>
                    <Progress percent={pct} strokeColor={pct >= 95 ? '#cf1322' : '#6C1ED9'} size="small" style={{ marginTop: 4 }} />
                  </div>
                  {curso.reconhecido && <Tag icon={<SafetyOutlined />} color="success" style={{ marginTop: 8, fontSize: 11 }}>Reconhecido MEC</Tag>}
                </Card>
              </List.Item>
            );
          }}
        />
      </Spin>
    </Space>
  );
}

function ModuloAlunos() {
  const dispatch = useDispatch();
  const { lista, loading, busca } = useSelector((s) => s.alunos);

  useEffect(() => { dispatch(fetchAlunos()); }, [dispatch]);

  const alunosFiltrados = busca
    ? lista.filter((a) => a.nome.toLowerCase().includes(busca.toLowerCase()) || a.curso.toLowerCase().includes(busca.toLowerCase()) || a.matricula.includes(busca))
    : lista;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle" wrap>
        <Col><Title level={4} style={{ margin: 0 }}>Corpo Discente</Title></Col>
        <Col>
          <Space wrap>
            <Input prefix={<SearchOutlined />} placeholder="Buscar por nome, curso ou matrícula..." value={busca} onChange={(e) => dispatch(setBusca(e.target.value))} style={{ width: 320 }} allowClear />
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#6C1ED9', borderColor: '#6C1ED9' }}>Novo Aluno</Button>
          </Space>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <List
          dataSource={alunosFiltrados}
          locale={{ emptyText: <Empty description="Nenhum aluno encontrado" /> }}
          style={{ background: 'transparent' }}
          renderItem={(aluno) => (
            <List.Item
              style={{ background: 'rgba(255,255,255,0.03)', marginBottom: 8, borderRadius: 12, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.08)' }}
              actions={[
                <Button key="ver" size="small" type="text">Ver perfil</Button>,
                <Button key="hist" size="small" type="text">Histórico</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar size={44} style={{ background: aluno.status === 'alerta' ? '#fa8c16' : '#6C1ED9', fontWeight: 700 }}>
                    {aluno.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </Avatar>
                }
                title={
                  <Space wrap>
                    <Text strong>{aluno.nome}</Text>
                    <Tag color={aluno.status === 'alerta' ? 'warning' : 'success'}>{aluno.status.toUpperCase()}</Tag>
                    {aluno.bolsa && <Tag color="gold" style={{ fontSize: 11 }}>{aluno.bolsa}</Tag>}
                    {aluno.estagioHospital && <Tag color="red" icon={<HeartOutlined />} style={{ fontSize: 11 }}>Estágio Hospital</Tag>}
                  </Space>
                }
                description={
                  <Space size={16} wrap>
                    <Text type="secondary" style={{ fontSize: 12 }}><BookOutlined /> {aluno.curso}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}><CalendarOutlined /> {aluno.semestre}º semestre</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}><FileTextOutlined /> Mat. {aluno.matricula}</Text>
                    <Text style={{ fontSize: 12, color: aluno.cr >= 7 ? '#52c41a' : aluno.cr >= 6 ? '#fa8c16' : '#cf1322', fontWeight: 600 }}>CR {aluno.cr.toFixed(1)}</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Spin>
    </Space>
  );
}

function ModuloHospital() {
  const dispatch = useDispatch();
  const { setores, loading } = useSelector((s) => s.hospital);

  useEffect(() => { dispatch(fetchInternamentos()); }, [dispatch]);

  const totalLeitos = setores.reduce((a, s) => a + s.leitos, 0);
  const totalOcupados = setores.reduce((a, s) => a + s.ocupados, 0);
  const taxaGeral = totalLeitos ? Math.round((totalOcupados / totalLeitos) * 100) : 0;

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle" wrap>
        <Col><Title level={4} style={{ margin: 0 }}>Hospital-Escola — Mapa de Ocupação</Title></Col>
        <Col>
          <Space>
            <Statistic title="Taxa Geral" value={taxaGeral} suffix="%" valueStyle={{ color: taxaGeral >= 90 ? '#cf1322' : '#d96704', fontSize: 22 }} />
            <Button icon={<ReloadOutlined />} onClick={() => dispatch(fetchInternamentos())}>Atualizar</Button>
          </Space>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
          dataSource={setores}
          renderItem={(setor) => {
            const pct = Math.round((setor.ocupados / setor.leitos) * 100);
            const cor = pct >= 95 ? '#cf1322' : pct >= 80 ? '#fa8c16' : '#52c41a';
            const statusMap = { crítico: 'error', alto: 'warning', normal: 'success' };
            return (
              <List.Item>
                <Card
                  hoverable
                  style={{ borderRadius: 16, borderTop: `3px solid ${cor}` }}
                  bodyStyle={{ padding: 20 }}
                >
                  <Space style={{ justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
                    <Space>
                      <Avatar size={40} icon={<MedicineBoxOutlined />} style={{ background: cor + '22', color: cor }} />
                      <div>
                        <Text strong>{setor.setor}</Text><br />
                        <Text type="secondary" style={{ fontSize: 12 }}>{setor.especialidade}</Text>
                      </div>
                    </Space>
                    <Badge status={statusMap[setor.status]} text={<Text style={{ fontSize: 12 }}>{setor.status}</Text>} />
                  </Space>
                  <Row gutter={16} style={{ marginBottom: 12 }}>
                    <Col span={8} style={{ textAlign: 'center' }}>
                      <Statistic title={<Text style={{ fontSize: 11 }}>Leitos</Text>} value={setor.leitos} valueStyle={{ fontSize: 20 }} />
                    </Col>
                    <Col span={8} style={{ textAlign: 'center' }}>
                      <Statistic title={<Text style={{ fontSize: 11 }}>Ocupados</Text>} value={setor.ocupados} valueStyle={{ fontSize: 20, color: cor }} />
                    </Col>
                    <Col span={8} style={{ textAlign: 'center' }}>
                      <Statistic title={<Text style={{ fontSize: 11 }}>Residentes</Text>} value={setor.residentesAtivos} valueStyle={{ fontSize: 20, color: '#6C1ED9' }} />
                    </Col>
                  </Row>
                  <Progress percent={pct} strokeColor={cor} status={pct >= 100 ? 'exception' : 'normal'} />
                  <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>Coord.: {setor.coordenador}</Text>
                </Card>
              </List.Item>
            );
          }}
        />
      </Spin>
    </Space>
  );
}

function ModuloFinanceiro() {
  const dispatch = useDispatch();
  const { lancamentos, loading } = useSelector((s) => s.financeiro);

  useEffect(() => { dispatch(fetchFinanceiro()); }, [dispatch]);

  const receitas = lancamentos.filter((l) => l.tipo === 'receita').reduce((a, l) => a + l.valor, 0);
  const despesas = lancamentos.filter((l) => l.tipo === 'despesa').reduce((a, l) => a + l.valor, 0);

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle" wrap>
        <Col><Title level={4} style={{ margin: 0 }}>Financeiro — Março / 2026</Title></Col>
        <Col><Button icon={<ReloadOutlined />} onClick={() => dispatch(fetchFinanceiro())}>Atualizar</Button></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><KpiCard titulo="Total de Receitas" valor={fmt(receitas)} cor="#52c41a" icone={<DollarOutlined />} /></Col>
        <Col xs={24} sm={8}><KpiCard titulo="Total de Despesas" valor={fmt(despesas)} cor="#cf1322" icone={<DollarOutlined />} /></Col>
        <Col xs={24} sm={8}><KpiCard titulo="Resultado" valor={fmt(receitas - despesas)} cor={receitas > despesas ? '#52c41a' : '#cf1322'} icone={<BarChartOutlined />} /></Col>
      </Row>
      <Spin spinning={loading}>
        <List
          dataSource={lancamentos}
          renderItem={(item) => {
            const statusColor = { recebido: 'success', pago: 'default', pendente: 'warning', 'a receber': 'processing' };
            return (
              <List.Item
                style={{ background: 'rgba(255,255,255,0.03)', marginBottom: 8, borderRadius: 12, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar size={40} style={{ background: item.tipo === 'receita' ? '#52c41a22' : '#cf132222', color: item.tipo === 'receita' ? '#52c41a' : '#cf1322' }}>
                      <DollarOutlined />
                    </Avatar>
                  }
                  title={<Space wrap><Text strong>{item.descricao}</Text><Tag color={statusColor[item.status]}>{item.status}</Tag><Tag>{item.categoria}</Tag></Space>}
                  description={<Text type="secondary" style={{ fontSize: 12 }}><CalendarOutlined /> {new Date(item.data).toLocaleDateString('pt-BR')}</Text>}
                />
                <Text style={{ fontSize: 18, fontWeight: 700, color: item.tipo === 'receita' ? '#52c41a' : '#cf1322', whiteSpace: 'nowrap' }}>
                  {item.tipo === 'receita' ? '+' : '-'} {fmt(item.valor)}
                </Text>
              </List.Item>
            );
          }}
        />
      </Spin>
    </Space>
  );
}

function AppShell() {
  const dispatch = useDispatch();
  const { collapsed, darkMode, moduloAtivo } = useSelector((s) => s.ui);
  const [notifOpen, setNotifOpen] = useState(false);
  const naoLidas = mockNotificacoes.filter((n) => !n.lida).length;

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'cursos', icon: <BookOutlined />, label: 'Cursos' },
    { key: 'alunos', icon: <TeamOutlined />, label: 'Alunos' },
    { key: 'hospital', icon: <MedicineBoxOutlined />, label: 'Hospital-Escola' },
    { key: 'financeiro', icon: <DollarOutlined />, label: 'Financeiro' },
    { type: 'divider' },
    { key: 'relatorios', icon: <BarChartOutlined />, label: 'Relatórios' },
    { key: 'configuracoes', icon: <SettingOutlined />, label: 'Configurações' },
  ];

  const renderModulo = () => {
    switch (moduloAtivo) {
      case 'cursos': return <ModuloCursos />;
      case 'alunos': return <ModuloAlunos />;
      case 'hospital': return <ModuloHospital />;
      case 'financeiro': return <ModuloFinanceiro />;
      default: return <ModuloDashboard />;
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: darkMode ? darkAlgorithm : defaultAlgorithm, token: { colorPrimary: '#6C1ED9', borderRadius: 10 } }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => dispatch(toggleSider())}
          trigger={null}
          width={240}
          style={{ background: darkMode ? '#0d0525' : '#fff', borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}
        >
          <div style={{ padding: collapsed ? '20px 8px' : '20px 24px', borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, marginBottom: 8 }}>
            {!collapsed
              ? <Space><Avatar size={32} style={{ background: '#6C1ED9', fontWeight: 700 }}>IE</Avatar><Text strong style={{ fontSize: 15, color: darkMode ? '#fff' : '#0d0525', letterSpacing: 0.5 }}>IEPI</Text></Space>
              : <Avatar size={32} style={{ background: '#6C1ED9', fontWeight: 700 }}>IE</Avatar>
            }
          </div>
          <Menu
            mode="inline"
            selectedKeys={[moduloAtivo]}
            items={menuItems}
            onSelect={({ key }) => dispatch(setModulo(key))}
            style={{ background: 'transparent', border: 'none', padding: '0 8px' }}
          />
          {!collapsed && (
            <div style={{ position: 'absolute', bottom: 20, left: 0, width: '100%', padding: '0 16px' }}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Divider style={{ margin: '8px 0' }} />
                <Space>
                  <Avatar size={32} style={{ background: '#d96704' }}>GS</Avatar>
                  <div>
                    <Text style={{ fontSize: 13, fontWeight: 600, display: 'block' }}>Gestão IEPI</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>Administrador</Text>
                  </div>
                </Space>
              </Space>
            </div>
          )}
        </Sider>

        <Layout>
          <Header style={{ background: darkMode ? '#140840' : '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, position: 'sticky', top: 0, zIndex: 100 }}>
            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => dispatch(toggleSider())} style={{ fontSize: 18 }} />
            <Space size={8}>
              <Button type="text" icon={darkMode ? <StarOutlined /> : <StarOutlined />} onClick={() => dispatch(toggleDark())} title={darkMode ? 'Modo claro' : 'Modo escuro'} />
              <Badge count={naoLidas} size="small" color="#6C1ED9">
                <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} onClick={() => setNotifOpen(true)} />
              </Badge>
              <Avatar size={34} style={{ background: '#d96704', cursor: 'pointer', fontWeight: 700 }}>GS</Avatar>
            </Space>
          </Header>

          <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px - 48px)', overflowY: 'auto' }}>
            {renderModulo()}
          </Content>

          <Footer style={{ textAlign: 'center', padding: '12px 24px', background: 'transparent' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Instituto de Ensino e Pesquisa Integrados · Sistema de Gestão Acadêmica e Hospitalar v2.0.0 · {new Date().getFullYear()}
            </Text>
          </Footer>
        </Layout>
      </Layout>

      <Drawer
        title={<Space><BellOutlined /><Text strong>Notificações</Text><Badge count={naoLidas} color="#6C1ED9" /></Space>}
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        width={380}
      >
        <List
          dataSource={mockNotificacoes}
          renderItem={(n) => {
            const iconMap = {
              alerta: <ExclamationCircleOutlined style={{ color: '#fa8c16', fontSize: 18 }} />,
              info: <ClockCircleOutlined style={{ color: '#0280a0', fontSize: 18 }} />,
              sucesso: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />,
            };
            return (
              <List.Item style={{ opacity: n.lida ? 0.5 : 1 }}>
                <List.Item.Meta
                  avatar={iconMap[n.tipo]}
                  title={<Text style={{ fontWeight: n.lida ? 400 : 600 }}>{n.titulo}</Text>}
                  description={<Space direction="vertical" size={2}><Text type="secondary" style={{ fontSize: 12 }}>{n.descricao}</Text><Text type="secondary" style={{ fontSize: 11 }}>{n.hora}</Text></Space>}
                />
              </List.Item>
            );
          }}
        />
      </Drawer>
    </ConfigProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
