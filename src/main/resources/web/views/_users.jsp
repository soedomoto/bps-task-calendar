<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<div id="users" class="list">
	<div class="header">
		<span class="icon-user"></span>
		<span>Petugas</span>
	</div>
	<ul></ul>
	<div class="footer">
		<span>Tambah Petugas</span>
	</div>
</div>

<div id="loginUser" style="display:none">
	<div class="title"><span>Login</span></div>
	<div class="cb-row">
		<div class="cb-key">Nama</div>
		<div class="cb-value">
			<input id="lbWho" type="text" />
		</div>
	</div>
	<div class="cb-row">
		<div class="cb-key">Password</div>
		<div class="cb-value">
			<input id="lbPass" type="password" />
		</div>
	</div>
	<div class="cb-action">
		<div id="btnLogin" class="button" style="float: left;">Login</div>
		<div id="status" style="float: right; max-width: 270px; text-align: right; 
				display: none; line-height: 29px; vertical-align: middle;"></div>
	</div>
</div>

<div id="addUser" style="display:none">
	<div class="title"><span>Petugas</span></div>
	<div class="" style="max-height: 310px">
		<div class="cb-row">
			<div class="cb-key">Nama Lengkap</div>
			<div class="cb-value">
				<input id="lbFullname" type="text" />
			</div>
		</div>
		<div class="cb-row">
			<div class="cb-key">Jabatan</div>
			<div class="cb-value">
				<div style="display: table-cell;">
					<input id="lbPosition" type="text" />
				</div>
				<div id="browsePosition" class="overflowmenu" style="height: auto;">
					<div class="icon"></div>
				</div>
			</div>
		</div>
		<div class="cb-row">
			<div class="cb-key">Warna</div>
			<div class="cb-value">
				<input id="lbColor" type="text" />
			</div>
		</div>
		<div class="cb-row">
			<div class="cb-key">Atasan Langsung</div>
			<div class="cb-value">
				<input id="lbSupervisor" type="text" />
			</div>
		</div>
		<div class="collapsible collapse">
			<div class="content">
				<div class="cb-row">
					<div class="cb-key">Username</div>
					<div class="cb-value">
						<input id="lbUsername" type="text" />
					</div>
				</div>
				<div class="cb-row">
					<div class="cb-key">Password</div>
					<div class="cb-value">
						<input id="lbPassword" type="password" />
					</div>
				</div>
				<div class="cb-row">
					<div class="cb-key">NIP</div>
					<div class="cb-value">
						<input id="lbNip" type="text" />
					</div>
				</div>
				<div class="cb-row">
					<div class="cb-key">Golongan</div>
					<div class="cb-value">
						<div style="display: table-cell;">
							<input id="lbRank" type="text" />
						</div>
						<div id="browseRank" class="overflowmenu" style="height: auto;">
							<div class="icon"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="button">
				<span class="icon-chevron-down"></span>
			</div>
		</div>
	</div>
	<div class="cb-action">
		<div id="btnAddUser" class="button">Simpan</div>
	</div>
</div>

<div id="editUser" style="display:none">
	<div class="title">
		<div id="lbCol" class="color"></div>
		<div style="padding: 5px 0 5px 30px;"><span id="lbTitle"></span></div>
	</div>
	<div class="collapsible collapse">
		<div class="content">
			<div class="cb-row">
				<div class="cb-key">Nama Lengkap</div>
				<div class="cb-value">
					<input id="lbFullname" type="text" />
				</div>
			</div>
			<div class="cb-row">
				<div class="cb-key">Jabatan</div>
				<div class="cb-value">
					<div style="display: table-cell;">
						<input id="lbPosition" type="text" />
					</div>
					<div id="browsePosition" class="overflowmenu" style="height: auto;">
						<div class="icon"></div>
					</div>
				</div>
			</div>
			<div class="cb-row">
				<div class="cb-key">Warna</div>
				<div class="cb-value">
					<input id="lbColor" type="text" />
				</div>
			</div>
			<div class="cb-row">
				<div class="cb-key">Atasan Langsung</div>
				<div class="cb-value">
					<input id="lbSupervisor" type="text" />
				</div>
			</div>
			<div class="cb-row">
				<div class="cb-key">NIP</div>
				<div class="cb-value">
					<input id="lbNip" type="text" />
				</div>
			</div>
			<div class="cb-row">
				<div class="cb-key">Golongan</div>
				<div class="cb-value">
					<div style="display: table-cell;">
						<input id="lbRank" type="text" />
					</div>
					<div id="browseRank" class="overflowmenu" style="height: auto;">
						<div class="icon"></div>
					</div>
				</div>
			</div>
			<div class="cb-action">
				<div id="btnUpdateUser" class="button" style="float: right;">Simpan</div>
			</div>
		</div>
		<div class="button">
			<span class="icon-chevron-down"></span>
		</div>
	</div>
	<div class="cb-action">
		<div id="btnDelUser" class="button">Hapus</div>
		<div class="overflowmenu">
			<div class="icon"></div>
			<div class="menu" position="left">
				<a target="_blank" id="lnPrintTL" href="#" style="color: initial;text-decoration: initial;">
					<div class="item">Cetak Surat Tugas</div>
				</a>
				<a target="_blank" id="lnPrintCKPT" href="#" style="color: initial;text-decoration: initial;">
					<div class="item">Lihat CKP-T</div>
				</a>
				<a target="_blank" id="lnEntryCKPR" href="#" style="color: initial;text-decoration: initial;">
					<div class="item">Entri CKP-R</div>
				</a>
			</div>
		</div>
	</div>
</div>